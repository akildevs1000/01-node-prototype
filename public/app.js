// Minimal Emirates ID Toolkit prototype client.
// Single button: Read Public Data
//   - Tears down any previous session
//   - Initializes (WebSocket -> list reader -> connect)
//   - Reads public data
//   - Posts the XML to /api/parse-public-data and shows the JSON
//
// Architecture: browser -> local Toolkit Agent (WebSocket) -> smartcard
//                browser -> Node /api/parse-public-data       (HTTP, JSON)

// Stubs for globals that eidatoolkit.js expects to be defined by the host page.
window.showLoader        = () => {};
window.hideLoader        = () => {};
window.displayProgress   = (msg) => setStatus(String(msg), 'info');
window.changeButtonState = () => {};

let ToolkitOB    = null;
let readerClass  = null;
let readyResolve = null;   // resolves the in-flight initialize() promise
let readyReject  = null;

const $status    = document.getElementById('status');
const $output    = document.getElementById('output');
const $btnPublic = document.getElementById('btnPublic');

function setStatus(text, kind = 'info') {
  $status.textContent = text;
  $status.className = 'status ' + kind;
  console.log(`[status:${kind}]`, text);
}

function setOutput(obj) {
  // If the response wraps an XML string, post it to the server's parser endpoint.
  if (obj && typeof obj === 'object' && typeof obj.tooklitResponse === 'string') {
    $output.textContent = '(parsing on server...)';
    fetch('/api/parse-public-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xml: obj.tooklitResponse })
    })
      .then(r => r.json())
      .then(j => {
        if (j.status === 'SUCCESS') {
          $output.textContent = JSON.stringify(j.data, null, 2);
        } else {
          $output.textContent = 'Parse failed: ' + j.message + '\n\nRaw response:\n' + obj.tooklitResponse;
        }
      })
      .catch(err => {
        $output.textContent = 'Parse request error: ' + err.message;
      });
    return;
  }
  $output.textContent = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
}

// Auto-pick TLS to the agent based on how the page itself is served.
const options = {
  jnlp_address: 'IDCardToolkitService.jnlp',
  debugEnabled: true,
  agent_tls_enabled: location.protocol === 'https:',
  agent_host_name: 'toolkitagent.emiratesid.ae',
  toolkitConfig:
    'vg_connection_timeout = 60\n' +
    'log_level = "INFO"\n' +
    'log_performance_time = true\n' +
    'read_publicdata_offline = true\n'
};

const IsSam = { sam_secure_messaging: true };

// ---------------------------------------------------------------------------
// SDK callbacks. These resolve/reject the in-flight initialize() promise.
// ---------------------------------------------------------------------------

function failInit(err) {
  const msg = err?.message || err?.errormessage || JSON.stringify(err);
  readerClass = null;
  ToolkitOB = null;
  if (readyReject) {
    const r = readyReject; readyReject = readyResolve = null;
    r(new Error(msg));
  }
  setStatus('Error: ' + msg, 'err');
}

function onError(err)  { failInit(err); }
function onClose()     { failInit(new Error('WebSocket closed')); }

function onOpen(_response, error) {
  if (error) return failInit(error);
  setStatus('WebSocket open. Listing readers...', 'info');
  if (IsSam.sam_secure_messaging) {
    ToolkitOB.getReaderWithEmiratesId(onReaderList);
  } else {
    ToolkitOB.listReaders(onReaderList);
  }
}

function onReaderList(response, error) {
  if (error) return failInit(error);
  if (IsSam.sam_secure_messaging) {
    readerClass = response;
  } else {
    if (!response || response.length === 0) return failInit(new Error('No readers found'));
    readerClass = response[0];
  }
  setStatus('Reader found. Connecting...', 'info');
  readerClass.connect(onConnect);
}

function onConnect(_response, error) {
  if (error) return failInit(error);
  setStatus('Card connected. Ready.', 'ok');
  readerClass.getInterfaceType(onInterface);
}

function onInterface(response, error) {
  if (error) return failInit(error);
  if (response === 2) {
    return failInit(new Error('NFC interface detected — insert a contact card instead.'));
  }
  // Init succeeded — resolve the in-flight initialize() promise.
  if (readyResolve) {
    const r = readyResolve; readyResolve = readyReject = null;
    r();
  }
}

// ---------------------------------------------------------------------------
// Teardown + initialize. initialize() returns a Promise.
// ---------------------------------------------------------------------------

function teardown(done) {
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    readerClass = null;
    ToolkitOB = null;
    done && done();
  };
  try {
    if (readerClass && typeof readerClass.disconnect === 'function') {
      readerClass.disconnect(() => finish());
    } else {
      finish();
    }
  } catch (_) {
    finish();
  }
  try { ToolkitOB?.closeWebSocket?.(); } catch (_) {}
  setTimeout(finish, 800);
}

function initialize() {
  return new Promise((resolve, reject) => {
    const startFresh = () => {
      readyResolve = resolve;
      readyReject  = reject;
      setStatus('Initializing...', 'info');
      try {
        ToolkitOB = new Toolkit(onOpen, onClose, onError, options);
      } catch (e) {
        readyResolve = readyReject = null;
        reject(e);
      }
    };
    if (ToolkitOB || readerClass) {
      setStatus('Resetting previous session...', 'info');
      teardown(startFresh);
    } else {
      startFresh();
    }
  });
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

$btnPublic.addEventListener('click', async () => {
  $btnPublic.disabled = true;
  try {
    // Always re-initialize to pick up the current card (handles card swaps).
    await initialize();

    setStatus('Reading public data...', 'info');
    const requestId = btoa(randomString(40));
    readerClass.readPublicData(requestId, true, true, true, true, true, (response, error) => {
      if (error) {
        setStatus('Public data error: ' + (error.message || error.errormessage), 'err');
      } else {
        setOutput(response);
        setStatus('Public data read. See output.', 'ok');
      }
      $btnPublic.disabled = false;
    });
  } catch (err) {
    setStatus('Read failed: ' + err.message, 'err');
    $btnPublic.disabled = false;
  }
});

function randomString(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

// Minimal Emirates ID Toolkit prototype client.
// Demonstrates: Initialize -> List/Connect reader -> Card Version -> Read Public Data.

// Stubs for globals that eidatoolkit.js expects to be defined by the host page.
// (FAIC's vendor sample defines these in toolkit_sample.js; we route them
// through our setStatus instead so they don't throw ReferenceError.)
window.showLoader      = () => setStatus('Working...', 'info');
window.hideLoader      = () => {};
window.displayProgress = (msg) => setStatus(String(msg), 'info');
window.changeButtonState = () => {};

let ToolkitOB = null;
let readerClass = null;

const $status = document.getElementById('status');
const $output = document.getElementById('output');
const $btnInit     = document.getElementById('btnInit');
const $btnRegister = document.getElementById('btnRegister');
const $btnVersion  = document.getElementById('btnVersion');
const $btnPublic   = document.getElementById('btnPublic');

function setStatus(text, kind = 'info') {
  $status.textContent = text;
  $status.className = 'status ' + kind;
  console.log(`[status:${kind}]`, text);
}

function setOutput(obj) {
  // If the response wraps an XML string in tooklitResponse, send it to the
  // server's /api/parse-public-data endpoint to get clean JSON.
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

function setButtons(enabled) {
  $btnRegister.disabled = !enabled;
  $btnVersion.disabled  = !enabled;
  $btnPublic.disabled   = !enabled;
}

// Auto-pick TLS to the agent based on how the page itself is served:
//   http://localhost     -> ws://127.0.0.1:9020       (dev, simple)
//   https://your-domain  -> wss://toolkitagent.emiratesid.ae:9020   (prod)
// This avoids browser mixed-content errors and Chrome's Private Network Access
// block when serving from a public IP.
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

function onError(err) {
  readerClass = null;
  ToolkitOB = null;
  setButtons(false);
  setStatus('Error: ' + (err?.message || JSON.stringify(err)), 'err');
}

function onClose() {
  ToolkitOB = null;
  readerClass = null;
  setButtons(false);
  setStatus('WebSocket closed.', 'info');
}

function onOpen(_response, error) {
  if (error) {
    setStatus('WebSocket open error: ' + error.message, 'err');
    return;
  }
  setStatus('WebSocket open. Listing readers...', 'info');
  if (IsSam.sam_secure_messaging) {
    ToolkitOB.getReaderWithEmiratesId(onReaderList);
  } else {
    ToolkitOB.listReaders(onReaderList);
  }
}

function onReaderList(response, error) {
  if (error) return onError(error);

  if (IsSam.sam_secure_messaging) {
    readerClass = response;
  } else {
    if (!response || response.length === 0) {
      setStatus('No readers found.', 'err');
      return;
    }
    readerClass = response[0];
  }
  setStatus('Reader found. Connecting...', 'info');
  readerClass.connect(onConnect);
}

function onConnect(_response, error) {
  if (error) {
    setStatus('Connect failed: ' + (error.message || error.code), 'err');
    return;
  }
  setStatus('Card connected. Ready.', 'ok');
  readerClass.getInterfaceType(onInterface);
}

function onInterface(response, error) {
  if (error) return onError(error);
  if (response === 2) {
    setStatus('NFC interface detected — set NFC params before reading. (Prototype does not implement NFC param entry; insert a contact card.)', 'err');
    return;
  }
  setButtons(true);
}

$btnInit.addEventListener('click', () => {
  if (ToolkitOB && readerClass) {
    setStatus('Already initialized.', 'info');
    setButtons(true);
    return;
  }
  setStatus('Initializing...', 'info');
  try {
    ToolkitOB = new Toolkit(onOpen, onClose, onError, options);
  } catch (e) {
    setStatus('Init threw: ' + e.message, 'err');
  }
});

$btnRegister.addEventListener('click', () => {
  if (!ToolkitOB) return setStatus('Not initialized.', 'err');
  setStatus('Registering device...', 'info');
  const requestId = btoa(randomString(40));
  ToolkitOB.prepareRequest(requestId, (response, error) => {
    if (error) return setStatus('Register failed: ' + error.message, 'err');
    setOutput(response);
    setStatus('Device registered. See output.', 'ok');
  });
});

$btnVersion.addEventListener('click', () => {
  if (!readerClass) return setStatus('Reader not initialized.', 'err');
  setStatus('Reading card version...', 'info');
  readerClass.getCardVersion((response, error) => {
    if (error) return setStatus('Version error: ' + (error.errormessage || error.message), 'err');
    setOutput(response);
    setStatus('Card version read.', 'ok');
  });
});

$btnPublic.addEventListener('click', () => {
  if (!readerClass) return setStatus('Reader not initialized.', 'err');
  setStatus('Reading public data...', 'info');
  const requestId = btoa(randomString(40));
  // Signature: readPublicData(requestId, nonModifiable, modifiable, fingerprintInfo, homeAddressFlag, addressFlag, callback)
  readerClass.readPublicData(requestId, true, true, true, true, true, (response, error) => {
    if (error) return setStatus('Public data error: ' + (error.message || error.errormessage), 'err');
    setOutput(response);
    setStatus('Public data read. See output.', 'ok');
  });
});

function randomString(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

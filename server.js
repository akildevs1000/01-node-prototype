const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const { DOMParser } = require('@xmldom/xmldom');
const { SignedXml } = require('xml-crypto');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function encryptParams(param, requestHandleB64, publicKeyB64) {
  const padding = Buffer.from(requestHandleB64, 'base64');
  const paramBytes = Buffer.from(param, 'utf8');
  const plain = Buffer.concat([padding, paramBytes]);

  const pubKey = crypto.createPublicKey({
    key: Buffer.from(publicKeyB64, 'base64'),
    format: 'der',
    type: 'spki'
  });

  const encrypted = crypto.publicEncrypt(
    { key: pubKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    plain
  );
  return encrypted.toString('base64');
}

app.post('/ToolkitController/pki/encrypt', (req, res) => {
  console.log('[encrypt] called');
  try {
    const { userName, requestHandle, publicKey } = req.body;
    if (!userName || !requestHandle || !publicKey) {
      return res.json({ status: 'FAILED', message: 'Missing field (userName/requestHandle/publicKey)' });
    }
    const result = encryptParams(userName, requestHandle, publicKey);
    res.json({ status: 'SUCCESS', message: result });
  } catch (e) {
    console.error('[encrypt] error:', e);
    res.json({ status: 'FAILED', message: e.message });
  }
});

app.post('/ToolkitController/pki/encode', (req, res) => {
  console.log('[encode] called');
  try {
    const { pin, requestHandle, publicKey } = req.body;
    if (!pin || !requestHandle || !publicKey) {
      return res.json({ status: 'FAILED', message: 'Missing field (pin/requestHandle/publicKey)' });
    }
    const result = encryptParams(pin, requestHandle, publicKey);
    res.json({ status: 'SUCCESS', message: result });
  } catch (e) {
    console.error('[encode] error:', e);
    res.json({ status: 'FAILED', message: e.message });
  }
});

app.post('/ToolkitController/pki/verify', (req, res) => {
  console.log('[verify] called');
  try {
    const { strXML } = req.body;
    if (!strXML) {
      return res.json({ status: 'FAILED', message: 'Missing strXML' });
    }

    const doc = new DOMParser().parseFromString(strXML, 'application/xml');

    const messageNodes = doc.getElementsByTagName('Message');
    if (messageNodes.length > 0) {
      const idAttr = messageNodes[0].getAttributeNode('xml:id');
      if (idAttr) messageNodes[0].setIdAttributeNode(idAttr, true);
    }

    const sigNodes = doc.getElementsByTagNameNS(
      'http://www.w3.org/2000/09/xmldsig#', 'Signature'
    );
    if (sigNodes.length === 0) {
      return res.json({ status: 'FAILED', message: 'No Signature element' });
    }

    const sig = new SignedXml({
      getCertFromKeyInfo: (keyInfo) => {
        const certNode = keyInfo[0]?.getElementsByTagNameNS?.(
          'http://www.w3.org/2000/09/xmldsig#', 'X509Certificate'
        )?.[0];
        if (!certNode) return null;
        const b64 = certNode.textContent.replace(/\s+/g, '');
        return `-----BEGIN CERTIFICATE-----\n${b64}\n-----END CERTIFICATE-----`;
      }
    });
    sig.loadSignature(sigNodes[0]);
    const ok = sig.checkSignature(strXML);

    res.json({
      status: ok ? 'SUCCESS' : 'FAILED',
      message: ok ? 'xml verified successfully' : 'xml verification failed'
    });
  } catch (e) {
    console.error('[verify] error:', e);
    res.json({ status: 'FAILED', message: e.message });
  }
});

// ---------------------------------------------------------------------------
// JSON API
// ---------------------------------------------------------------------------
//
// POST /api/parse-public-data
//   Body: { "xml": "<ValidationGatewayResponse>...", "verify": false }
//   Returns clean JSON extracted from the card's public-data response.
//   When `verify` is true, also runs XML signature verification and
//   only returns data if the signature is valid.
//
// GET  /api
//   Lists available endpoints.
//
// GET  /health
//   Liveness probe.
//

function nodeToJson(node) {
  const elementChildren = [];
  for (let i = 0; i < node.childNodes.length; i++) {
    const c = node.childNodes[i];
    if (c.nodeType === 1) elementChildren.push(c);
  }
  if (elementChildren.length === 0) {
    const text = (node.textContent || '').trim();
    return text === '' ? null : text;
  }
  const result = {};
  for (const child of elementChildren) {
    const value = nodeToJson(child);
    if (value === null) continue;
    const name = child.localName || child.nodeName;
    if (result[name] === undefined) {
      result[name] = value;
    } else {
      if (!Array.isArray(result[name])) result[name] = [result[name]];
      result[name].push(value);
    }
  }
  return Object.keys(result).length === 0 ? null : result;
}

function xmlToObject(xmlString) {
  const doc = new DOMParser().parseFromString(xmlString, 'application/xml');
  const errNode = doc.getElementsByTagName('parsererror')[0];
  if (errNode) throw new Error('XML parse error: ' + errNode.textContent);
  return { [doc.documentElement.localName]: nodeToJson(doc.documentElement) };
}

function addressBlock(a) {
  if (!a) return null;
  return {
    typeCode: a.AddressTypeCode || null,
    locationCode: a.LocationCode || null,
    emiratesCode: a.EmiratesCode || null,
    emiratesEnglish: a.EmiratesDescEnglish || null,
    emiratesArabic: a.EmiratesDescArabic || null,
    cityCode: a.CityCode || null,
    cityEnglish: a.CityDescEnglish || null,
    cityArabic: a.CityDescArabic || null,
    streetEnglish: a.StreetEnglish || null,
    streetArabic: a.StreetArabic || null,
    areaCode: a.AreaCode || null,
    areaEnglish: a.AreaDescEnglish || null,
    areaArabic: a.AreaDescArabic || null,
    poBox: a.POBOX || null,
    buildingEnglish: a.BuildingNameEnglish || null,
    buildingArabic: a.BuildingNameArabic || null,
    flatNo: a.FlatNo || null,
    landPhoneNumber: a.LandPhoneNumber || a.ResidentPhoneNumber || null,
    mobilePhoneNumber: a.MobilePhoneNumber || null,
    email: a.Email || null,
    companyArabic: a.CompanyNameArabic || null
  };
}

function extractPublicData(parsed) {
  const root = parsed.ValidationGatewayResponse;
  if (!root) return null;
  const header = root.Message?.Header || {};
  const body   = root.Message?.Body   || {};
  const pd     = body.PublicData;
  if (!pd) return null;

  const nm = pd.NonModifiableData || {};
  const md = pd.ModifiableData    || {};
  const ha = pd.HomeAddress       || {};
  const wa = pd.WorkAddress       || {};

  return {
    request: {
      service:          header.Service          || null,
      action:           header.Action           || null,
      requestId:        header.RequestID        || null,
      timestamp:        header.Timestamp        || null,
      cardSerialNumber: header.CardSerialNumber || null
    },
    responseStatus: body.ResponseStatus || null,
    identity: {
      idNumber:            pd.IdNumber || header.IDNumber || null,
      cardNumber:          pd.CardNumber || header.CardNumber || null,
      issueDate:           nm.IssueDate           || null,
      expiryDate:          nm.ExpiryDate          || null,
      fullNameEnglish:     nm.FullNameEnglish     || null,
      fullNameArabic:      nm.FullNameArabic      || null,
      titleEnglish:        nm.TitleEnglish        || null,
      titleArabic:         nm.TitleArabic         || null,
      gender:              nm.Gender              || null,
      dateOfBirth:         nm.DateOfBirth         || null,
      placeOfBirthEnglish: nm.PlaceOfBirthEnglish || null,
      placeOfBirthArabic:  nm.PlaceOfBirthArabic  || null,
      nationality: {
        code:    nm.NationalityCode    || null,
        english: nm.NationalityEnglish || null,
        arabic:  nm.NationalityArabic  || null
      }
    },
    occupation: {
      code:           md.OccupationCode        || null,
      english:        md.OccupationEnglish     || null,
      arabic:         md.OccupationArabic      || null,
      typeEnglish:    md.OccupationTypeEnglish || null,
      typeArabic:     md.OccupationTypeArabic  || null,
      fieldCode:      md.OccupationFieldCode   || null,
      companyEnglish: md.CompanyNameEnglish    || null,
      companyArabic:  md.CompanyNameArabic     || null
    },
    family: {
      familyId:              md.FamilyId              || null,
      maritalStatusCode:     md.MaritalStatusCode     || null,
      husbandIdNumber:       md.HusbandIdNumber       || null,
      motherFullNameEnglish: md.MotherFullNameEnglish || null,
      motherFullNameArabic:  md.MotherFullNameArabic  || null
    },
    sponsor: {
      typeCode:      md.SponsorTypeCode      || null,
      unifiedNumber: md.SponsorUnifiedNumber || null,
      name:          md.SponsorName          || null
    },
    residency: {
      typeCode:   md.ResidencyTypeCode   || null,
      number:     md.ResidencyNumber     || null,
      expiryDate: md.ResidencyExpiryDate || null
    },
    passport: {
      number:         md.PassportNumber         || null,
      typeCode:       md.PassportTypeCode       || null,
      countryCode:    md.PassportCountryCode    || null,
      countryEnglish: md.PassportCountryEnglish || null,
      countryArabic:  md.PassportCountryArabic  || null,
      issueDate:      md.PassportIssueDate      || null,
      expiryDate:     md.PassportExpiryDate     || null
    },
    qualification: {
      levelCode:           md.QualificationLevelCode    || null,
      levelEnglish:        md.QualificationLevelEnglish || null,
      levelArabic:         md.QualificationLevelArabic  || null,
      degreeEnglish:       md.DegreeDescriptionEnglish  || null,
      degreeArabic:        md.DegreeDescriptionArabic   || null,
      fieldOfStudyCode:    md.FieldOfStudyCode          || null,
      fieldOfStudyEnglish: md.FieldOfStudyEnglish       || null,
      fieldOfStudyArabic:  md.FieldOfStudyArabic        || null,
      placeOfStudyEnglish: md.PlaceOfStudyEnglish       || null,
      placeOfStudyArabic:  md.PlaceOfStudyArabic        || null,
      dateOfGraduation:    md.DateOfGraduation          || null
    },
    homeAddress: addressBlock(ha),
    workAddress: addressBlock(wa)
  };
}

function verifyXmlSignature(xmlString) {
  const doc = new DOMParser().parseFromString(xmlString, 'application/xml');
  const messageNodes = doc.getElementsByTagName('Message');
  if (messageNodes.length > 0) {
    const idAttr = messageNodes[0].getAttributeNode('xml:id');
    if (idAttr) messageNodes[0].setIdAttributeNode(idAttr, true);
  }
  const sigNodes = doc.getElementsByTagNameNS('http://www.w3.org/2000/09/xmldsig#', 'Signature');
  if (sigNodes.length === 0) return { ok: false, reason: 'No Signature element' };

  const sig = new SignedXml({
    getCertFromKeyInfo: (keyInfo) => {
      const certNode = keyInfo[0]?.getElementsByTagNameNS?.(
        'http://www.w3.org/2000/09/xmldsig#', 'X509Certificate'
      )?.[0];
      if (!certNode) return null;
      const b64 = certNode.textContent.replace(/\s+/g, '');
      return `-----BEGIN CERTIFICATE-----\n${b64}\n-----END CERTIFICATE-----`;
    }
  });
  sig.loadSignature(sigNodes[0]);
  return { ok: sig.checkSignature(xmlString) };
}

app.post('/api/parse-public-data', (req, res) => {
  console.log('[parse-public-data] called');
  try {
    const xml = req.body.xml || req.body.strXML;
    const verify = !!req.body.verify;
    if (!xml || typeof xml !== 'string') {
      return res.status(400).json({ status: 'FAILED', message: 'Body must include "xml" string' });
    }

    let signature = null;
    if (verify) {
      const v = verifyXmlSignature(xml);
      signature = v;
      if (!v.ok) {
        return res.status(400).json({
          status: 'FAILED',
          message: 'Signature verification failed',
          signature
        });
      }
    }

    const parsed = xmlToObject(xml);
    const data = extractPublicData(parsed);
    if (!data) {
      return res.status(400).json({ status: 'FAILED', message: 'Could not extract PublicData from XML' });
    }

    res.json({ status: 'SUCCESS', signature, data });
  } catch (e) {
    console.error('[parse-public-data] error:', e);
    res.status(500).json({ status: 'FAILED', message: e.message });
  }
});

app.get('/api', (_req, res) => {
  res.json({
    service: 'eid-prototype',
    endpoints: [
      { method: 'POST', path: '/api/parse-public-data', body: '{ xml: string, verify?: boolean }' },
      { method: 'POST', path: '/ToolkitController/pki/encrypt', body: '{ userName, requestHandle, publicKey }' },
      { method: 'POST', path: '/ToolkitController/pki/encode',  body: '{ pin, requestHandle, publicKey }' },
      { method: 'POST', path: '/ToolkitController/pki/verify',  body: '{ strXML }' },
      { method: 'GET',  path: '/health' }
    ]
  });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 7841;
app.listen(PORT, () => {
  console.log(`EID prototype backend listening on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/ in a browser to test.`);
});

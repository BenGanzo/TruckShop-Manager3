import 'server-only';
import {
  initializeApp, getApps, getApp,
  applicationDefault, cert, App
} from 'firebase-admin/app';

function normalizePrivateKey(raw?: string): string | undefined {
  if (!raw) return undefined;
  // 1) Des-escapa \\n -> \n
  let pk = raw.replace(/\\n/g, '\n').trim();
  // 2) Si vino en base64, decodifica
  try {
    if (/^[A-Za-z0-9+/=]+$/.test(pk) && !pk.includes('BEGIN')) {
      const decoded = Buffer.from(pk, 'base64').toString('utf8').trim();
      if (decoded.includes('BEGIN PRIVATE KEY')) pk = decoded;
    }
  } catch { /* noop */ }
  // 3) Si está en una sola línea, inserta saltos al menos en header/footer
  if (!pk.includes('\n') && pk.includes('BEGIN PRIVATE KEY')) {
    pk = pk
      .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
      .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n');
  }
  return pk;
}

export function getAdminApp(): App {
  if (getApps().length) return getApp();

  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  const pkSeparated = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  const pkBase64 = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY_BASE64);

  if (svc) {
    const json = JSON.parse(svc.replace(/\\n/g, '\n'));
    if (json.private_key) json.private_key = normalizePrivateKey(json.private_key);
    return initializeApp({ credential: cert(json) });
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && (pkSeparated || pkBase64)) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: pkSeparated || pkBase64!,
      }),
    });
  }

  return initializeApp({ credential: applicationDefault() });
}

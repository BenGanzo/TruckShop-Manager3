// src/lib/firebase-admin.ts
import 'server-only';
import {
  initializeApp, getApps, getApp,
  applicationDefault, cert, App
} from 'firebase-admin/app';

const HEADER = '-----BEGIN PRIVATE KEY-----';
const FOOTER = '-----END PRIVATE KEY-----';

function chunk64(s: string) {
  return (s.match(/.{1,64}/g) || []).join('\n');
}

function normalizePrivateKey(raw?: string): string | undefined {
  if (!raw) return undefined;
  let s = raw.replace(/\\n/g, '\n').trim();
  try {
    if (!s.includes(HEADER) && /^[A-Za-z0-9+/=]+$/.test(s)) {
      const dec = Buffer.from(s, 'base64').toString('utf8').trim();
      if (dec.includes('PRIVATE KEY')) s = dec;
    }
  } catch {}
  if (s.includes(HEADER) && s.includes(FOOTER)) {
    const body = s
      .slice(s.indexOf(HEADER) + HEADER.length, s.indexOf(FOOTER))
      .replace(/[\r\n\s]/g, '');
    return `${HEADER}\n${chunk64(body)}\n${FOOTER}\n`;
  }
  const bodyOnly = s.replace(/[\r\n\s-]+/g, '');
  return `${HEADER}\n${chunk64(bodyOnly)}\n${FOOTER}\n`;
}

export function getAdminApp(): App {
  if (getApps().length) return getApp();

  // 1) Variables separadas (preferido)
  const pkEnv = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  const pkB64 = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY_BASE64);
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && (pkEnv || pkB64)) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: pkEnv || pkB64!,
      }),
    });
  }

  // 2) SERVICE_ACCOUNT (JSON) si existe
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (svc) {
    const json = JSON.parse(svc.replace(/\\n/g, '\n'));
    if (json.private_key) json.private_key = normalizePrivateKey(json.private_key);
    return initializeApp({ credential: cert(json) });
  }

  // 3) ADC como último recurso
  return initializeApp({ credential: applicationDefault() });
}
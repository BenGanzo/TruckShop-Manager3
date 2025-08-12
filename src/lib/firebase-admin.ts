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

  // 1) des-escapa \n si viene de .env
  let s = raw.replace(/\\n/g, '\n').trim();

  // 2) si parece base64 sin header, intenta decodificar
  try {
    if (!s.includes(HEADER) && /^[A-Za-z0-9+/=]+$/.test(s)) {
      const dec = Buffer.from(s, 'base64').toString('utf8').trim();
      if (dec.includes('PRIVATE KEY')) s = dec;
    }
  } catch { /* noop */ }

  // 3) si ya tiene header/footer, reconstruye el cuerpo con líneas de 64
  if (s.includes(HEADER) && s.includes(FOOTER)) {
    const body = s
      .slice(s.indexOf(HEADER) + HEADER.length, s.indexOf(FOOTER))
      .replace(/[\r\n\s]/g, '');
    return `${HEADER}\n${chunk64(body)}\n${FOOTER}\n`;
  }

  // 4) si no tiene header/footer, asume que es solo el body
  const bodyOnly = s.replace(/[\r\n\s-]+/g, '');
  return `${HEADER}\n${chunk64(bodyOnly)}\n${FOOTER}\n`;
}

export function getAdminApp(): App {
  if (getApps().length) return getApp();

  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  const pkEnv = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  const pkB64 = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY_BASE64);

  if (svc) {
    const json = JSON.parse(svc.replace(/\\n/g, '\n'));
    if (json.private_key) json.private_key = normalizePrivateKey(json.private_key);
    return initializeApp({ credential: cert(json) });
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && (pkEnv || pkB64)) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: pkEnv || pkB64!,
      }),
    });
  }

  // ADC como último recurso (entornos GCP)
  return initializeApp({ credential: applicationDefault() });
}
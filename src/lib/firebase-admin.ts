// src/lib/firebase-admin.ts
import 'server-only';
import { initializeApp, getApps, getApp, applicationDefault, cert, App } from 'firebase-admin/app';

/**
 * Devuelve una instancia de Admin App **siempre inicializada**.
 * Soporta 3 modos de credenciales:
 *  - FIREBASE_SERVICE_ACCOUNT: JSON completo (con \n escapados)
 *  - Vars separadas: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 *  - ADC: applicationDefault() (Cloud Run / Workstations)
 */
export function getAdminApp(): App {
  if (getApps().length) return getApp();

  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (svc) {
    return initializeApp({
      credential: cert(JSON.parse(svc.replace(/\\n/g, '\n'))),
    });
  }

  if (process.env.FIREBASE_PROJECT_ID) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  }

  // Fallback: ADC (si hay credenciales en el entorno)
  return initializeApp({ credential: applicationDefault() });
}

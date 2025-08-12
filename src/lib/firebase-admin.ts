// src/lib/firebase-admin.ts
import 'server-only';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';

let adminApp;

if (!getApps().length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccount) {
     adminApp = initializeApp({
        credential: cert(JSON.parse(serviceAccount.replace(/\\n/g, '\n'))),
     });
  } else {
     // Fallback for environments where ADC might be configured
     adminApp = initializeApp();
  }
} else {
  adminApp = getApp();
}

export { adminApp };

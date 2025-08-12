// src/lib/firebase-admin.ts
import 'server-only';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    // Fallback for environments where ADC might be configured (e.g. Google Cloud Run)
    // or separate env vars are provided.
     if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
            // IMPORTANTE: convertir "\n" literales en saltos de línea reales
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        }),
        });
     } else {
        admin.initializeApp();
     }
  } else {
     admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount.replace(/\\n/g, '\n'))),
    });
  }
}

export { admin };

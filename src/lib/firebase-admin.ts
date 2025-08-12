// src/lib/firebase-admin.ts
import 'server-only';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (serviceAccount) {
    // Modo 1: JSON completo en FIREBASE_SERVICE_ACCOUNT
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(serviceAccount.replace(/\\n/g, '\n'))
      ),
    });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Modo 2: Vars separadas
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        // ¡Importante! Reemplazar \n literales por saltos reales
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // Modo 3: ADC (p.ej. Cloud Run / Workstations con credenciales ya presentes)
    admin.initializeApp();
  }
}

export { admin };

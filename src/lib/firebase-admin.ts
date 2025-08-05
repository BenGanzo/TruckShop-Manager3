
import * as admin from 'firebase-admin';

// This is a server-only file. It is used for administrative tasks.
// Do not import this file on the client.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
}

const parsedServiceAccount = JSON.parse(serviceAccount);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(parsedServiceAccount),
    });
}

export const adminApp = admin.apps[0]!;
export const adminDb = admin.firestore();

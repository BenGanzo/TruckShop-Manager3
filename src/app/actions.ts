'use server';

import type { Asset, Owner, Truck, WorkOrder, CatalogPart, CatalogLabor, Supplier, PurchaseOrder, User, Trailer } from '@/lib/types';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore, FieldValue } from 'firebase-admin/firestore';

// Function to get admin services lazily and ensure singleton pattern
function getAdminServices() {
    if (admin.apps.length === 0) {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!serviceAccount) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
        }
        
        const parsedServiceAccount = JSON.parse(serviceAccount);

        admin.initializeApp({
            credential: admin.credential.cert(parsedServiceAccount),
        });
    }
    const adminDb = getAdminFirestore();
    const adminAuth = getAuth();
    return { adminDb, adminAuth };
}


export async function getPartRecommendations(input: any) {
    // Placeholder for actual AI call
    console.log('Getting recommendations for:', input.problemDescription);
    // In a real app, you would import and call your Genkit flow here.
    // For now, returning a hardcoded success response.
    const { workOrderPartRecommendation } = await import('@/ai/flows/work-order-part-recommendation');

    try {
        const result = await workOrderPartRecommendation(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error in getPartRecommendations:', error);
        return { success: false, error: 'Failed to get AI recommendations.' };
    }
}


export async function importAssets(companyId: string, assets: Asset[]): Promise<{ success: number, errors: number }> {
  if (!companyId) {
    throw new Error('Company ID is required to import assets.');
  }
  if (!assets || assets.length === 0) {
    throw new Error('No assets provided for import.');
  }

  const { adminDb } = getAdminServices();
  const batch = adminDb.batch();
  let successCount = 0;
  let errorCount = 0;

  const companyRef = adminDb.collection('mainCompanies').doc(companyId);

  for (const asset of assets) {
    if (!asset.id) {
      errorCount++;
      continue;
    }

    // Determine if it's a truck or trailer
    const isTrailer = !!asset.trailerType && asset.trailerType.trim() !== '';
    const collectionName = isTrailer ? 'trailers' : 'trucks';
    
    const assetCollectionRef = companyRef.collection(collectionName);
    const assetDocRef = assetCollectionRef.doc(asset.id);

    const dataToSet = {
      ...asset,
      companyId: companyId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    // Remove the 'id' from the data object itself as it's the document ID
    delete (dataToSet as any).id;

    batch.set(assetDocRef, dataToSet, { merge: true });
    successCount++;
  }

  try {
    await batch.commit();
    return { success: successCount, errors: errorCount };
  } catch (error) {
    console.error('Error committing batch import:', error);
    throw new Error('Failed to save imported assets to the database.');
  }
}

export async function addTruck(companyId: string, truckData: Truck): Promise<{ success: boolean; error?: string }> {
    if (!companyId) {
        return { success: false, error: 'Company ID is required.' };
    }

    try {
        const { adminDb } = getAdminServices();
        const companyRef = adminDb.collection('mainCompanies').doc(companyId);
        const trucksCollectionRef = companyRef.collection('trucks');
        const truckDocRef = trucksCollectionRef.doc(truckData.id);
        
        const dataToSet = {
            ...truckData,
            companyId: companyId,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        await truckDocRef.set(dataToSet);

        return { success: true };
    } catch (error: any) {
        console.error('Error adding truck:', error);
        return { success: false, error: 'Failed to save the truck to the database.' };
    }
}

export async function updateTruck(companyId: string, truckId: string, truckData: Partial<Truck>): Promise<{ success: boolean; error?: string }> {
    if (!companyId || !truckId) {
        return { success: false, error: 'Company ID and Truck ID are required.' };
    }

    try {
        const { adminDb } = getAdminServices();
        const truckDocRef = adminDb.collection('mainCompanies').doc(companyId).collection('trucks').doc(truckId);
        
        // Remove id from the data to prevent it from being written to the document
        const dataToUpdate = { ...truckData };
        delete dataToUpdate.id;

        await truckDocRef.update({
            ...dataToUpdate,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error updating truck:', error);
        return { success: false, error: 'Failed to update the truck in the database.' };
    }
}

export async function updateTrailer(companyId: string, trailerId: string, trailerData: Partial<any>): Promise<{ success: boolean; error?: string }> {
    if (!companyId || !trailerId) {
        return { success: false, error: 'Company ID and Trailer ID are required.' };
    }

    try {
        const { adminDb } = getAdminServices();
        const trailerDocRef = adminDb.collection('mainCompanies').doc(companyId).collection('trailers').doc(trailerId);
        
        const dataToUpdate = { ...trailerData };
        delete dataToUpdate.id;

        await trailerDocRef.update({
            ...dataToUpdate,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error updating trailer:', error);
        return { success: false, error: 'Failed to update the trailer in the database.' };
    }
}

export async function updateCompany(companyId: string, companyData: any): Promise<{ success: boolean; error?: string }> {
    if (!companyId) {
        return { success: false, error: 'Company ID is required.' };
    }

    try {
        const { adminDb } = getAdminServices();
        const companyDocRef = adminDb.collection('mainCompanies').doc(companyId);
        
        await companyDocRef.update({
            ...companyData,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error updating company:', error);
        return { success: false, error: 'Failed to update the company in the database.' };
    }
}

export async function assignTrucksToOwner(companyId: string, truckIds: string[], ownerId: string): Promise<{ success: boolean; error?: string }> {
    if (!companyId || !truckIds || truckIds.length === 0 || !ownerId) {
        return { success: false, error: 'Invalid arguments provided for assignment.' };
    }

    try {
        const { adminDb } = getAdminServices();
        const batch = adminDb.batch();
        const companyRef = adminDb.collection('mainCompanies').doc(companyId);
        const trucksCollectionRef = companyRef.collection('trucks');

        truckIds.forEach(truckId => {
            const truckDocRef = trucksCollectionRef.doc(truckId);
            batch.update(truckDocRef, { ownerId: ownerId });
        });

        await batch.commit();

        return { success: true };
    } catch (error: any) {
        console.error('Error assigning trucks to owner:', error);
        return { success: false, error: 'Failed to update truck assignments in the database.' };
    }
}

export async function assignTrailersToOwner(companyId: string, trailerIds: string[], ownerId: string): Promise<{ success: boolean; error?: string }> {
    if (!companyId || !trailerIds || trailerIds.length === 0 || !ownerId) {
        return { success: false, error: 'Invalid arguments provided for assignment.' };
    }

    try {
        const { adminDb } = getAdminServices();
        const batch = adminDb.batch();
        const companyRef = adminDb.collection('mainCompanies').doc(companyId);
        const trailersCollectionRef = companyRef.collection('trailers');

        trailerIds.forEach(trailerId => {
            const trailerDocRef = trailersCollectionRef.doc(trailerId);
            batch.update(trailerDocRef, { ownerId: ownerId });
        });

        await batch.commit();

        return { success: true };
    } catch (error: any) {
        console.error('Error assigning trailers to owner:', error);
        return { success: false, error: 'Failed to update trailer assignments in the database.' };
    }
}


export async function addOwner(companyId: string, ownerData: Omit<Owner, 'id'>): Promise<{ success: boolean; error?: string; }> {
    if (!companyId) {
        return { success: false, error: 'Company ID is required.' };
    }

    try {
        const { adminDb } = getAdminServices();
        const companyRef = adminDb.collection('mainCompanies').doc(companyId);
        const ownersCollectionRef = companyRef.collection('owners');
        
        const newOwnerDocRef = ownersCollectionRef.doc();

        const dataToSet = {
            ...ownerData,
            id: newOwnerDocRef.id,
            companyId: companyId,
            createdAt: FieldValue.serverTimestamp(),
        };

        await newOwnerDocRef.set(dataToSet);

        return { success: true };
    } catch (error: any) {
        console.error('Error adding owner:', error);
        return { success: false, error: 'Failed to save the owner to the database.' };
    }
}

export async function updateOwner(companyId: string, ownerId: string, ownerData: Partial<Owner>): Promise<{ success: boolean; error?: string }> {
    if (!companyId || !ownerId) {
        return { success: false, error: 'Company ID and Owner ID are required.' };
    }

    try {
        const { adminDb } = getAdminServices();
        const ownerDocRef = adminDb.collection('mainCompanies').doc(companyId).collection('owners').doc(ownerId);
        
        await ownerDocRef.update({
            ...ownerData,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error updating owner:', error);
        return { success: false, error: 'Failed to update the owner in the database.' };
    }
}

// Function to get the next Work Order ID
async function getNextWorkOrderId(companyId: string): Promise<string> {
    const { adminDb } = getAdminServices();
    const workOrdersRef = adminDb.collection('mainCompanies').doc(companyId).collection('workOrders');
    const q = workOrdersRef.orderBy('numericId', 'desc').limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
        return 'WO-1001';
    }

    const lastWorkOrder = querySnapshot.docs[0].data();
    const lastId = lastWorkOrder.numericId || 1000;
    const nextId = lastId + 1;
    return `WO-${nextId}`;
}


export async function addWorkOrder(companyId: string, workOrderData: Omit<WorkOrder, 'id' | 'numericId'>): Promise<{ success: boolean; error?: string; workOrderId?: string; }> {
    if (!companyId) {
        return { success: false, error: 'Company ID is required.' };
    }

    try {
        const { adminDb } = getAdminServices();
        const companyRef = adminDb.collection('mainCompanies').doc(companyId);
        const workOrdersCollectionRef = companyRef.collection('workOrders');
        
        const workOrderId = await getNextWorkOrderId(companyId);
        const numericId = parseInt(workOrderId.split('-')[1]);

        const newWorkOrderDocRef = workOrdersCollectionRef.doc(workOrderId);

        const dataToSet: Omit<WorkOrder, 'createdAt'> & { createdAt: any } = {
            ...workOrderData,
            id: workOrderId,
            numericId: numericId,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        await newWorkOrderDocRef.set(dataToSet);

        return { success: true, workOrderId: workOrderId };
    } catch (error: any) {
        console.error('Error adding work order:', error);
        return { success: false, error: 'Failed to save the work order to the database.' };
    }
}

export async function addCatalogPart(companyId: string, partData: Omit<CatalogPart, 'id' | 'type'>): Promise<{ success: boolean; error?: string }> {
    if (!companyId) return { success: false, error: 'Company ID is required.' };
    
    try {
        const { adminDb } = getAdminServices();
        const catalogRef = adminDb.collection('mainCompanies').doc(companyId).collection('catalog');
        const partDocRef = catalogRef.doc(partData.partId);

        await partDocRef.set({
            ...partData,
            type: 'part',
            createdAt: FieldValue.serverTimestamp(),
        });
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function addCatalogLabor(companyId: string, laborData: Omit<CatalogLabor, 'id' | 'type'>): Promise<{ success: boolean; error?: string }> {
    if (!companyId) return { success: false, error: 'Company ID is required.' };

    try {
        const { adminDb } = getAdminServices();
        const catalogRef = adminDb.collection('mainCompanies').doc(companyId).collection('catalog');
        const laborDocRef = catalogRef.doc();

        await laborDocRef.set({
            ...laborData,
            id: laborDocRef.id,
            type: 'labor',
            createdAt: FieldValue.serverTimestamp(),
        });
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function addSupplier(companyId: string, supplierData: Omit<Supplier, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string; supplierId?: string }> {
    if (!companyId) {
        return { success: false, error: 'Company ID is required.' };
    }
    try {
        const { adminDb } = getAdminServices();
        const suppliersRef = adminDb.collection('mainCompanies').doc(companyId).collection('suppliers');
        const newDocRef = await suppliersRef.add({
            ...supplierData,
            createdAt: FieldValue.serverTimestamp(),
        });
        await newDocRef.update({ id: newDocRef.id });
        return { success: true, supplierId: newDocRef.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function getNextPurchaseOrderId(companyId: string): Promise<string> {
    const { adminDb } = getAdminServices();
    const poRef = adminDb.collection('mainCompanies').doc(companyId).collection('purchaseOrders');
    const q = poRef.orderBy('numericId', 'desc').limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
        return 'PO-1001';
    }
    const lastPO = querySnapshot.docs[0].data();
    const lastId = lastPO.numericId || 1000;
    const nextId = lastId + 1;
    return `PO-${nextId}`;
}

export async function addPurchaseOrder(companyId: string, poData: Omit<PurchaseOrder, 'id' | 'numericId'>): Promise<{ success: boolean; error?: string; purchaseOrderId?: string }> {
    if (!companyId) {
        return { success: false, error: 'Company ID is required.' };
    }
    try {
        const { adminDb } = getAdminServices();
        const poRef = adminDb.collection('mainCompanies').doc(companyId).collection('purchaseOrders');
        const poId = await getNextPurchaseOrderId(companyId);
        const numericId = parseInt(poId.split('-')[1]);

        const poDocRef = poRef.doc(poId);

        const dataToSet: Omit<PurchaseOrder, 'createdAt'> & { createdAt: any } = {
            ...poData,
            id: poId,
            numericId: numericId,
            createdAt: FieldValue.serverTimestamp(),
        };

        await poDocRef.set(dataToSet);
        return { success: true, purchaseOrderId: poId };
    } catch (error: any) {
        console.error('Error adding purchase order:', error);
        return { success: false, error: error.message };
    }
}

export async function addUser(companyId: string, userData: any): Promise<{ success: boolean; error?: string; }> {
  if (!companyId) {
    return { success: false, error: 'Company ID is required.' };
  }
  if (!userData.email || !userData.password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const { adminDb, adminAuth } = getAdminServices();
    // 1. Create user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: `${userData.firstName} ${userData.lastName}`,
    });

    // 2. Create user document in Firestore subcollection
    const userDocRef = adminDb.collection('mainCompanies').doc(companyId).collection('users').doc(userRecord.uid);
    
    const dataToSet: Omit<User, 'createdAt' | 'updatedAt'> = {
        id: userRecord.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isActive: true,
    };

    await userDocRef.set({
        ...dataToSet,
        createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error adding user:", error);
    // Provide a more user-friendly error message
    let errorMessage = 'An unknown error occurred.';
    if (error.code === 'auth/email-already-exists') {
        errorMessage = 'This email is already in use by another account.';
    } else if (error.code === 'auth/invalid-password') {
        errorMessage = 'The password must be at least 6 characters long.';
    }
    return { success: false, error: errorMessage };
  }
}

'use server';

import { getFirestore, collection, writeBatch, doc, serverTimestamp, setDoc, updateDoc, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { Asset, Owner, Truck, WorkOrder, CatalogPart, CatalogLabor, Supplier, PurchaseOrder, User } from '@/lib/types';

const db = getFirestore(app);

// NOTE: This is a special server-side instance of the Auth SDK.
// It is used for administrative tasks like creating users.
// It's different from the client-side `auth` from `lib/firebase.ts`.
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';

const adminAuth = getAuth(adminApp);


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

  const batch = writeBatch(db);
  let successCount = 0;
  let errorCount = 0;

  const companyRef = doc(db, 'mainCompanies', companyId);

  for (const asset of assets) {
    if (!asset.id) {
      errorCount++;
      continue;
    }

    // Determine if it's a truck or trailer
    const isTrailer = !!asset.trailerType && asset.trailerType.trim() !== '';
    const collectionName = isTrailer ? 'trailers' : 'trucks';
    
    const assetCollectionRef = collection(companyRef, collectionName);
    const assetDocRef = doc(assetCollectionRef, asset.id);

    const dataToSet = {
      ...asset,
      companyId: companyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
        const companyRef = doc(db, 'mainCompanies', companyId);
        const trucksCollectionRef = collection(companyRef, 'trucks');
        const truckDocRef = doc(trucksCollectionRef, truckData.id);
        
        const dataToSet = {
            ...truckData,
            companyId: companyId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(truckDocRef, dataToSet);

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
        const truckDocRef = doc(db, 'mainCompanies', companyId, 'trucks', truckId);
        
        // Remove id from the data to prevent it from being written to the document
        const dataToUpdate = { ...truckData };
        delete dataToUpdate.id;

        await updateDoc(truckDocRef, {
            ...dataToUpdate,
            updatedAt: serverTimestamp(),
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error updating truck:', error);
        return { success: false, error: 'Failed to update the truck in the database.' };
    }
}

export async function updateCompany(companyId: string, companyData: any): Promise<{ success: boolean; error?: string }> {
    if (!companyId) {
        return { success: false, error: 'Company ID is required.' };
    }

    try {
        const companyDocRef = doc(db, 'mainCompanies', companyId);
        
        await updateDoc(companyDocRef, {
            ...companyData,
            updatedAt: serverTimestamp(),
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
        const batch = writeBatch(db);
        const companyRef = doc(db, 'mainCompanies', companyId);
        const trucksCollectionRef = collection(companyRef, 'trucks');

        truckIds.forEach(truckId => {
            const truckDocRef = doc(trucksCollectionRef, truckId);
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
        const batch = writeBatch(db);
        const companyRef = doc(db, 'mainCompanies', companyId);
        const trailersCollectionRef = collection(companyRef, 'trailers');

        trailerIds.forEach(trailerId => {
            const trailerDocRef = doc(trailersCollectionRef, trailerId);
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
        const companyRef = doc(db, 'mainCompanies', companyId);
        const ownersCollectionRef = collection(companyRef, 'owners');
        
        // Firestore will auto-generate an ID for the new document
        const newOwnerDocRef = doc(ownersCollectionRef);

        const dataToSet = {
            ...ownerData,
            id: newOwnerDocRef.id,
            companyId: companyId,
            createdAt: serverTimestamp(),
        };

        await setDoc(newOwnerDocRef, dataToSet);

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
        const ownerDocRef = doc(db, 'mainCompanies', companyId, 'owners', ownerId);
        
        await updateDoc(ownerDocRef, {
            ...ownerData,
            updatedAt: serverTimestamp(),
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error updating owner:', error);
        return { success: false, error: 'Failed to update the owner in the database.' };
    }
}

// Function to get the next Work Order ID
async function getNextWorkOrderId(companyId: string): Promise<string> {
    const workOrdersRef = collection(db, 'mainCompanies', companyId, 'workOrders');
    const q = query(workOrdersRef, orderBy('numericId', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

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
        const companyRef = doc(db, 'mainCompanies', companyId);
        const workOrdersCollectionRef = collection(companyRef, 'workOrders');
        
        const workOrderId = await getNextWorkOrderId(companyId);
        const numericId = parseInt(workOrderId.split('-')[1]);

        const newWorkOrderDocRef = doc(workOrdersCollectionRef, workOrderId);

        const dataToSet = {
            ...workOrderData,
            id: workOrderId,
            numericId: numericId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(newWorkOrderDocRef, dataToSet);

        return { success: true, workOrderId: workOrderId };
    } catch (error: any) {
        console.error('Error adding work order:', error);
        return { success: false, error: 'Failed to save the work order to the database.' };
    }
}

export async function addCatalogPart(companyId: string, partData: Omit<CatalogPart, 'id'>): Promise<{ success: boolean; error?: string }> {
    if (!companyId) return { success: false, error: 'Company ID is required.' };
    
    try {
        const catalogRef = collection(db, 'mainCompanies', companyId, 'catalog');
        const partDocRef = doc(catalogRef, partData.partId);

        await setDoc(partDocRef, {
            ...partData,
            type: 'part',
            createdAt: serverTimestamp(),
        });
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function addCatalogLabor(companyId: string, laborData: Omit<CatalogLabor, 'id'>): Promise<{ success: boolean; error?: string }> {
    if (!companyId) return { success: false, error: 'Company ID is required.' };

    try {
        const catalogRef = collection(db, 'mainCompanies', companyId, 'catalog');
        const laborDocRef = doc(catalogRef); // Auto-generate ID

        await setDoc(laborDocRef, {
            ...laborData,
            id: laborDocRef.id,
            type: 'labor',
            createdAt: serverTimestamp(),
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
        const suppliersRef = collection(db, 'mainCompanies', companyId, 'suppliers');
        const newDocRef = await addDoc(suppliersRef, {
            ...supplierData,
            createdAt: serverTimestamp(),
        });
        await updateDoc(newDocRef, { id: newDocRef.id });
        return { success: true, supplierId: newDocRef.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function getNextPurchaseOrderId(companyId: string): Promise<string> {
    const poRef = collection(db, 'mainCompanies', companyId, 'purchaseOrders');
    const q = query(poRef, orderBy('numericId', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

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
        const poRef = collection(db, 'mainCompanies', companyId, 'purchaseOrders');
        const poId = await getNextPurchaseOrderId(companyId);
        const numericId = parseInt(poId.split('-')[1]);

        const poDocRef = doc(poRef, poId);

        const dataToSet: PurchaseOrder = {
            ...poData,
            id: poId,
            numericId: numericId,
            createdAt: serverTimestamp(),
        };

        await setDoc(poDocRef, dataToSet);
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
    // 1. Create user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: `${userData.firstName} ${userData.lastName}`,
    });

    // 2. Create user document in Firestore subcollection
    const userDocRef = doc(db, 'mainCompanies', companyId, 'users', userRecord.uid);
    
    const dataToSet: User = {
        id: userRecord.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isActive: true,
        createdAt: serverTimestamp(),
    };

    await setDoc(userDocRef, dataToSet);

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

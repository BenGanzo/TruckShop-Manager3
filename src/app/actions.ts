
'use server';

import { getFirestore, collection, writeBatch, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { Asset, Owner, Truck } from '@/lib/types';

const db = getFirestore(app);

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

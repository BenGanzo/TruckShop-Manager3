
'use server';

import { getFirestore, collection, writeBatch, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { z } from 'zod';
import type { Asset, Truck } from '@/lib/types';

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
        
        await addDoc(trucksCollectionRef, {
            ...truckData,
            companyId: companyId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error adding truck:', error);
        return { success: false, error: 'Failed to save the truck to the database.' };
    }
}

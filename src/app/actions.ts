
'use server';

import { workOrderPartRecommendation, WorkOrderPartRecommendationInput } from '@/ai/flows/work-order-part-recommendation';
import { getFirestore, collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { z } from 'zod';
import type { Asset } from '@/lib/types';

const db = getFirestore(app);

export async function getPartRecommendations(input: WorkOrderPartRecommendationInput) {
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

  for (const asset of assets) {
    if (!asset.id) {
      errorCount++;
      continue;
    }

    // Determine if it's a truck or trailer
    const isTrailer = !!asset.trailerType && asset.trailerType.trim() !== '';
    const collectionName = isTrailer ? 'trailers' : 'trucks';

    const assetDocRef = doc(db, 'mainCompanies', companyId, collectionName, asset.id);

    const dataToSet = {
      ...asset,
      companyId: companyId, // Add companyId to the document
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

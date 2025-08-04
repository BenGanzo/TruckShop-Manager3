
'use server';

import { workOrderPartRecommendation, WorkOrderPartRecommendationInput } from '@/ai/flows/work-order-part-recommendation';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { z } from 'zod';

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

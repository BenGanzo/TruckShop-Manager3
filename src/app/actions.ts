'use server';

import { workOrderPartRecommendation, WorkOrderPartRecommendationInput } from '@/ai/flows/work-order-part-recommendation';

export async function getPartRecommendations(input: WorkOrderPartRecommendationInput) {
  try {
    const result = await workOrderPartRecommendation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get recommendations.' };
  }
}

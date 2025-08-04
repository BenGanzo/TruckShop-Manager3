
'use server';

import { workOrderPartRecommendation, WorkOrderPartRecommendationInput } from '@/ai/flows/work-order-part-recommendation';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { z } from 'zod';

const db = getFirestore(app);

// This is a simplified schema. In a real app, you'd get the companyId from auth.
const workOrderSchema = z.object({
  vehicleId: z.string(),
  mechanicId: z.string(),
  problemDescription: z.string(),
  arrivalDate: z.date().optional(),
  departureDate: z.date().optional(),
  nextServiceDate: z.date().optional(),
  currentMileage: z.number().optional(),
  nextServiceMiles: z.number().optional(),
  status: z.string(),
  parts: z.array(z.any()),
  labor: z.array(z.any()),
  taxRate: z.number(),
});

type WorkOrderData = z.infer<typeof workOrderSchema>;


export async function getPartRecommendations(input: WorkOrderPartRecommendationInput) {
  try {
    const result = await workOrderPartRecommendation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getPartRecommendations:', error);
    return { success: false, error: 'Failed to get AI recommendations.' };
  }
}


export async function createWorkOrder(data: WorkOrderData) {
    try {
        // Hardcoding companyId for now. In a real app, this would come from the authenticated user's session/claims.
        const companyId = 'angulo-transportation';
        if (!companyId) {
            throw new Error('User is not associated with a company.');
        }

        const workOrdersCollectionRef = collection(db, 'mainCompanies', companyId, 'workOrders');

        const docRef = await addDoc(workOrdersCollectionRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return { success: true, workOrderId: docRef.id };
    } catch (error: any) {
        console.error('Error creating work order:', error);
        return { success: false, error: error.message || 'An unknown error occurred.' };
    }
}

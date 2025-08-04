// Work-order-part-recommendation.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered parts and labor recommendations based on a work order's problem description.
 *
 * - workOrderPartRecommendation - A function that takes a problem description and returns recommended parts and labor.
 * - WorkOrderPartRecommendationInput - The input type for the workOrderPartRecommendation function.
 * - WorkOrderPartRecommendationOutput - The return type for the workOrderPartRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WorkOrderPartRecommendationInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('The description of the problem reported in the work order.'),
});
export type WorkOrderPartRecommendationInput = z.infer<
  typeof WorkOrderPartRecommendationInputSchema
>;

const WorkOrderPartRecommendationOutputSchema = z.object({
  recommendedParts: z
    .array(z.string())
    .describe('A list of recommended parts for the work order.'),
  recommendedLabor: z
    .array(z.string())
    .describe('A list of recommended labor tasks for the work order.'),
});
export type WorkOrderPartRecommendationOutput = z.infer<
  typeof WorkOrderPartRecommendationOutputSchema
>;

export async function workOrderPartRecommendation(
  input: WorkOrderPartRecommendationInput
): Promise<WorkOrderPartRecommendationOutput> {
  return workOrderPartRecommendationFlow(input);
}

const workOrderPartRecommendationPrompt = ai.definePrompt({
  name: 'workOrderPartRecommendationPrompt',
  input: {schema: WorkOrderPartRecommendationInputSchema},
  output: {schema: WorkOrderPartRecommendationOutputSchema},
  prompt: `You are an AI assistant providing recommendations for parts and labor required for a work order, given a problem description.  Return the response as a JSON object.

Problem Description: {{{problemDescription}}}

Consider the problem description and recommend parts and labor that are most likely to be needed.
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const workOrderPartRecommendationFlow = ai.defineFlow(
  {
    name: 'workOrderPartRecommendationFlow',
    inputSchema: WorkOrderPartRecommendationInputSchema,
    outputSchema: WorkOrderPartRecommendationOutputSchema,
  },
  async input => {
    const {output} = await workOrderPartRecommendationPrompt(input);
    return output!;
  }
);


'use server';

/**
 * @fileOverview A flow to simulate sending an M-Pesa STK push for payments.
 *
 * - sendStkPush - A function that simulates initiating a payment prompt.
 * - StkPushInput - The input type for the sendStkPush function.
 * - StkPushOutput - The return type for the sendStkPush function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StkPushInputSchema = z.object({
  phone: z.string().describe('The phone number to send the STK push to.'),
  amount: z.number().describe('The amount to request in KES.'),
});
export type StkPushInput = z.infer<typeof StkPushInputSchema>;

const StkPushOutputSchema = z.object({
  success: z.boolean().describe('Whether the STK push was successfully initiated.'),
  message: z.string().describe('A message describing the result of the operation.'),
});
export type StkPushOutput = z.infer<typeof StkPushOutputSchema>;


export async function sendStkPush(input: StkPushInput): Promise<StkPushOutput> {
  return sendStkPushFlow(input);
}


const sendStkPushFlow = ai.defineFlow(
  {
    name: 'sendStkPushFlow',
    inputSchema: StkPushInputSchema,
    outputSchema: StkPushOutputSchema,
  },
  async (input) => {
    console.log(`Simulating STK push to ${input.phone} for KES ${input.amount}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real application, you would make an API call to M-Pesa here.
    // For this simulation, we will always return a success response.
    return {
      success: true,
      message: `Payment prompt for KES ${input.amount} sent to ${input.phone}. Please enter your PIN to complete the transaction.`,
    };
  }
);

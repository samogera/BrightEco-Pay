
'use server';

/**
 * @fileOverview A flow to handle and process support ticket submissions.
 * It stores the ticket in Firestore for manual processing.
 *
 * - submitTicket - A function that takes support ticket data and stores it.
 * - SubmitTicketInput - The input type for the submitTicket function.
 * - SubmitTicketOutput - The return type for the submitTicket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getFirestore, collection, addDoc, serverTimestamp} from 'firebase/firestore';
import {app} from '@/lib/firebase';

const SubmitTicketInputSchema = z.object({
  name: z.string().describe('The full name of the person submitting the ticket.'),
  email: z.string().email().describe('The email address of the person submitting.'),
  phone: z.string().optional().describe('The phone number of the person submitting.'),
  title: z.string().describe('The title of the support ticket.'),
  message: z.string().describe('The detailed message or description of the issue.'),
});
export type SubmitTicketInput = z.infer<typeof SubmitTicketInputSchema>;

const SubmitTicketOutputSchema = z.object({
  success: z.boolean().describe('Whether the ticket submission was successfully processed.'),
  message: z.string().describe('A message describing the result of the operation.'),
  ticketId: z.string().optional().describe('The ID of the created ticket document.'),
});
export type SubmitTicketOutput = z.infer<typeof SubmitTicketOutputSchema>;


export async function submitTicket(input: SubmitTicketInput): Promise<SubmitTicketOutput> {
  return submitTicketFlow(input);
}

const submitTicketFlow = ai.defineFlow(
  {
    name: 'submitTicketFlow',
    inputSchema: SubmitTicketInputSchema,
    outputSchema: SubmitTicketOutputSchema,
  },
  async (input) => {
    
    const db = getFirestore(app);
    const ticketsCollection = collection(db, 'support_tickets');

    const emailBody = `
      ========================================
      New Support Ticket from BrightEco Pay
      ========================================
      
      A new support ticket has been submitted.

      --- User Details ---
      Name: ${input.name}
      Email: ${input.email}
      Phone: ${input.phone || 'Not provided'}
      
      --- Ticket Details ---
      Title: ${input.title}
      
      Message:
      ${input.message}
      
      ========================================
    `;

    try {
        const docRef = await addDoc(ticketsCollection, {
            to: 'robinsonoolakak@gmail.com',
            subject: 'BrightEco Energy',
            body: emailBody,
            userDetails: {
                name: input.name,
                email: input.email,
                phone: input.phone,
            },
            title: input.title,
            message: input.message,
            status: 'new',
            createdAt: serverTimestamp()
        });

        console.log('Support ticket stored in Firestore with ID: ', docRef.id);

        return {
            success: true,
            message: 'Your support ticket has been received. Our team will get back to you shortly.',
            ticketId: docRef.id
        };

    } catch (error) {
        console.error("Error writing document to Firestore: ", error);
        return {
            success: false,
            message: 'There was an error saving your ticket. Please try again later.',
        }
    }
  }
);

    
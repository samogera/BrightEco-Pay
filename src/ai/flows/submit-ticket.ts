
'use server';

/**
 * @fileOverview A flow to handle and process support ticket submissions.
 * It simulates sending the ticket to support for manual processing.
 *
 * - submitTicket - A function that takes support ticket data and stores it.
 * - SubmitTicketInput - The input type for the submitTicket function.
 * - SubmitTicketOutput - The return type for the submitTicket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    
    const emailBody = `
      ========================================
      New Support Ticket for BrightEco Pay
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
    
    // Simulate sending an email or creating a ticket in a support system.
    // In a real app, this would integrate with a service like SendGrid, or a CRM.
    console.log("Simulating support ticket submission...");
    console.log("Recipient: robinsonolaka@gmail.com");
    console.log("Subject: BrightEco Energy Support Request");
    console.log("Body:", emailBody);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const simulatedTicketId = `ticket_${Date.now()}`;

    // Always return success for this simulation
    return {
        success: true,
        message: 'Your support ticket has been received. Our team will get back to you shortly.',
        ticketId: simulatedTicketId
    };
  }
);

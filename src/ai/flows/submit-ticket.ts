
'use server';

/**
 * @fileOverview A flow to handle and process support ticket submissions.
 *
 * - submitTicket - A function that takes support ticket data and simulates sending it.
 * - SubmitTicketInput - The input type for the submitTicket function.
 * - SubmitTicketOutput - The return type for the submitTicket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SubmitTicketInputSchema = z.object({
  name: z.string().describe('The full name of the person submitting the ticket.'),
  email: z.string().email().describe('The email address of the person submitting.'),
  phone: z.string().optional().describe('The phone number of the person submitting.'),
  location: z.string().optional().describe('The location of the person submitting.'),
  subject: z.string().describe('The subject or category of the support ticket.'),
  message: z.string().describe('The detailed message or description of the issue.'),
});
export type SubmitTicketInput = z.infer<typeof SubmitTicketInputSchema>;

const SubmitTicketOutputSchema = z.object({
  success: z.boolean().describe('Whether the ticket submission was successfully processed.'),
  message: z.string().describe('A message describing the result of the operation.'),
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
    
    // In a real application, you would integrate an email service like SendGrid or Resend here.
    // For this simulation, we will format the ticket as an email and log it to the console.
    
    const emailBody = `
      ========================================
      New Support Ticket from BrightEco Pay
      ========================================
      
      A new support ticket has been submitted via the website.

      --- User Details ---
      Name: ${input.name}
      Email: ${input.email}
      Phone: ${input.phone || 'Not provided'}
      Location: ${input.location || 'Not provided'}
      
      --- Ticket Details ---
      Subject: ${input.subject}
      
      Message:
      ${input.message}
      
      ========================================
    `;

    console.log('--- SIMULATING EMAIL ---');
    console.log('To: robinsonoolakak@gmail.com');
    console.log('From: support@brighteco-pay.com');
    console.log('Subject: New Support Ticket: ' + input.subject);
    console.log('Body:');
    console.log(emailBody);
    console.log('--- END OF SIMULATION ---');

    // Simulate API call delay for sending the email
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: 'Your support ticket has been received. Our team will get back to you shortly.',
    };
  }
);

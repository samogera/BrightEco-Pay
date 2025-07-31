
'use server';

/**
 * @fileOverview An AI agent to provide advice on solar energy system devices.
 *
 * - getDeviceAdvice - A function that analyzes device data and provides recommendations.
 * - GetDeviceAdviceInput - The input type for the getDeviceAdvice function.
 * - GetDeviceAdviceOutput - The return type for the getDeviceAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DeviceSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    status: z.string(),
    metrics: z.record(z.any()),
});

const GetDeviceAdviceInputSchema = z.object({
  devices: z.array(DeviceSchema).describe('An array of solar energy system devices with their current status and metrics. Can be empty if generating a general report.'),
});
export type GetDeviceAdviceInput = z.infer<typeof GetDeviceAdviceInputSchema>;

const GetDeviceAdviceOutputSchema = z.object({
  advice: z.string().describe('Actionable advice and recommendations for the provided devices, including an overall efficiency score.'),
});
export type GetDeviceAdviceOutput = z.infer<typeof GetDeviceAdviceOutputSchema>;

export async function getDeviceAdvice(input: GetDeviceAdviceInput): Promise<GetDeviceAdviceOutput> {
  return getDeviceAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDeviceAdvicePrompt',
  input: { schema: GetDeviceAdviceInputSchema },
  output: { schema: GetDeviceAdviceOutputSchema },
  prompt: `You are an expert solar energy technician AI. Your task is to analyze the health and performance of a residential solar energy system and provide actionable advice.

{{#if devices.length}}
Here is the device data:
{{#each devices}}
- Device: {{name}} ({{id}})
  - Type: {{type}}
  - Status: {{status}}
  - Metrics:
    {{#each metrics}}
    - {{@key}}: {{this}}
    {{/each}}
---
{{/each}}
Based on the data, do the following:
- Identify potential issues (e.g., offline devices, low efficiency, poor battery health).
- Recommend maintenance actions.
- Suggest optimizations for better performance.
- Highlight any immediate risks.
{{else}}
The user has requested a general efficiency report. Do the following:
- Generate an overall system efficiency score between 75 and 98 percent.
- Provide 3-4 actionable, easy-to-understand tips for a typical residential user to improve their energy efficiency. Examples: "Clean solar panels quarterly," "Shift heavy appliance usage to peak sun hours," etc.
{{/if}}


Present your advice in a clear, concise, and easy-to-understand format. Use a bulleted list for recommendations. Start with the Efficiency Score if requested.
`,
});

const getDeviceAdviceFlow = ai.defineFlow(
  {
    name: 'getDeviceAdviceFlow',
    inputSchema: GetDeviceAdviceInputSchema,
    outputSchema: GetDeviceAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

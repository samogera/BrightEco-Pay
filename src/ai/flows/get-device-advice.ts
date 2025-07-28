
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
  devices: z.array(DeviceSchema).describe('An array of solar energy system devices with their current status and metrics.'),
});
export type GetDeviceAdviceInput = z.infer<typeof GetDeviceAdviceInputSchema>;

const GetDeviceAdviceOutputSchema = z.object({
  advice: z.string().describe('Actionable advice and recommendations for the provided devices.'),
});
export type GetDeviceAdviceOutput = z.infer<typeof GetDeviceAdviceOutputSchema>;

export async function getDeviceAdvice(input: GetDeviceAdviceInput): Promise<GetDeviceAdviceOutput> {
  return getDeviceAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDeviceAdvicePrompt',
  input: { schema: GetDeviceAdviceInputSchema },
  output: { schema: GetDeviceAdviceOutputSchema },
  prompt: `You are an expert solar energy technician AI. Your task is to analyze the health and performance of the following solar energy system components and provide actionable advice.

Focus on:
- Identifying potential issues (e.g., offline devices, low efficiency, poor battery health).
- Recommending maintenance actions.
- Suggesting optimizations for better performance.
- Highlighting any immediate risks.

Present your advice in a clear, concise, and easy-to-understand format. Use a bulleted list for recommendations.

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

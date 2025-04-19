'use server';

/**
 * @fileOverview Extracts data types (user, output, time, and date) from text, including nested JSON structures, using GenAI.
 *
 * - extractData - Extracts specified data types from text.
 * - ExtractDataInput - The input type for the extractData function.
 * - ExtractDataOutput - The return type for the extractData function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'zod';

const ExtractDataInputSchema = z.object({
  text: z.string().describe('The text to extract data from.'),
});

export type ExtractDataInput = z.infer<typeof ExtractDataInputSchema>;

const ExtractDataOutputSchema = z.object({
  user: z.array(z.string()).describe('The users mentioned in the text.'),
  output: z.array(z.string()).describe('The outputs or results mentioned in the text.'),
  time: z.array(z.string()).describe('The times mentioned in the text.'),
  date: z.array(z.string()).describe('The dates mentioned in the text.'),
});

export type ExtractDataOutput = z.infer<typeof ExtractDataOutputSchema>;

export async function extractData(input: ExtractDataInput): Promise<ExtractDataOutput> {
  return extractDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDataPrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to extract data from.'),
    }),
  },
  output: {
    schema: z.object({
      user: z.array(z.string()).describe('The users mentioned in the text.'),
      output: z.array(z.string()).describe('The outputs or results mentioned in the text.'),
      time: z.array(z.string()).describe('The times mentioned in the text.'),
      date: z.array(z.string()).describe('The dates mentioned in the text.'),
    }),
  },
  prompt: `You are an expert at extracting specific information from text, including JSON structures.
Given the following text, please extract all instances of users, outputs, times, and dates if present, including within JSON objects.
If a piece of information is not present, the corresponding field should be an empty array.

Text: {{{text}}}

Output the extracted information as arrays in JSON format.`,
});

const extractDataFlow = ai.defineFlow<
  typeof ExtractDataInputSchema,
  typeof ExtractDataOutputSchema
>(
  {
    name: 'extractDataFlow',
    inputSchema: ExtractDataInputSchema,
    outputSchema: ExtractDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

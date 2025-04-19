'use server';

/**
 * @fileOverview Programmatically removes duplicate sentences from a given text, including support for JSON input.
 *
 * - removeDuplicateSentences - A function that removes duplicate sentences from a given text, optionally extracting the text from a "Data" field in JSON.
 * - RemoveDuplicateSentencesInput - The input type for the removeDuplicateSentences function.
 * - RemoveDuplicateSentencesOutput - The return type for the removeDuplicateSentences function.
 */

import {z} from 'zod';

const RemoveDuplicateSentencesInputSchema = z.object({
  text: z.string().describe('The text to remove duplicate sentences from, or a JSON string containing a "Data" field with the text.'),
});

export type RemoveDuplicateSentencesInput = z.infer<
  typeof RemoveDuplicateSentencesInputSchema
>;

const RemoveDuplicateSentencesOutputSchema = z.object({
  processedText: z.string().describe('The text with duplicate sentences removed.'),
});

export type RemoveDuplicateSentencesOutput = z.infer<
  typeof RemoveDuplicateSentencesOutputSchema
>;

/**
 * Removes duplicate sentences from a given text, with support for JSON input containing a "Data" field.
 *
 * @param {string} text - The input text or a JSON string.
 * @returns {string} The processed text with duplicate sentences removed.
 */
export async function removeDuplicateSentences(
  input: RemoveDuplicateSentencesInput
): Promise<RemoveDuplicateSentencesOutput> {
  let {text} = input;
  if (!text) {
    return {processedText: ''};
  }

  // Attempt to parse JSON and extract the "Data" field.
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && 'Data' in parsed && typeof parsed.Data === 'string') {
      text = parsed.Data;
    }
  } catch (error) {
    // If parsing fails, assume the input is plain text.
    console.log('Input is not JSON, processing as plain text.');
  }

  if (!text) {
    return {processedText: ''};
  }

  // Split the text into sentences.
  const sentences = text.split(/[.?!]/).map(s => s.trim()).filter(s => s.length > 0);

  // Use a Set to store unique sentences.
  const uniqueSentences = new Set<string>();

  // Array to store the processed sentences in order.
  const processedSentences: string[] = [];

  for (const sentence of sentences) {
    // Convert the sentence to lowercase for case-insensitive comparison.
    const lowerCaseSentence = sentence.toLowerCase();

    // If the sentence is not in the Set, add it and to the processed sentences.
    if (!uniqueSentences.has(lowerCaseSentence)) {
      uniqueSentences.add(lowerCaseSentence);
      processedSentences.push(sentence);
    }
  }

  // Join the processed sentences back into a single string.
  const processedText = processedSentences.join('. ') + '.';
  return {processedText};
}

// src/ai/flows/invoice-ocr.ts
'use server';
/**
 * @fileOverview A flow to scan invoices using OCR and extract relevant information.
 *
 * - invoiceOcr - A function that handles the invoice scanning process.
 * - InvoiceOcrInput - The input type for the invoiceOcr function.
 * - InvoiceOcrOutput - The return type for the invoiceOcr function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvoiceOcrInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type InvoiceOcrInput = z.infer<typeof InvoiceOcrInputSchema>;

const InvoiceOcrOutputSchema = z.object({
  supplierName: z.string().describe('The name of the supplier.'),
  amount: z.number().describe('The total amount due on the invoice.'),
  items: z
    .array(z.string())
    .describe('A list of items included in the invoice.'),
});
export type InvoiceOcrOutput = z.infer<typeof InvoiceOcrOutputSchema>;

export async function invoiceOcr(input: InvoiceOcrInput): Promise<InvoiceOcrOutput> {
  return invoiceOcrFlow(input);
}

const invoiceOcrPrompt = ai.definePrompt({
  name: 'invoiceOcrPrompt',
  input: {schema: InvoiceOcrInputSchema},
  output: {schema: InvoiceOcrOutputSchema},
  prompt: `You are an expert accounting assistant. You will receive a photo of an invoice and extract the relevant information from it, including the supplier name, the total amount due, and a list of items included in the invoice.

  Analyze the invoice in the photo and extract the information in JSON format. Return a valid JSON object.
  Photo: {{media url=photoDataUri}}`,
});

const invoiceOcrFlow = ai.defineFlow(
  {
    name: 'invoiceOcrFlow',
    inputSchema: InvoiceOcrInputSchema,
    outputSchema: InvoiceOcrOutputSchema,
  },
  async input => {
    const {output} = await invoiceOcrPrompt(input);
    return output!;
  }
);

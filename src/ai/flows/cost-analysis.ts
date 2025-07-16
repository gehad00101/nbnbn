'use server';

/**
 * @fileOverview Cost analysis and reporting flow for a coffee shop.
 *
 * - analyzeCosts - Analyzes coffee shop expenses and identifies impactful costs.
 * - CostAnalysisInput - Input type for the analyzeCosts function.
 * - CostAnalysisOutput - Return type for the analyzeCosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CostAnalysisInputSchema = z.object({
  expensesData: z
    .string()
    .describe(
      'Detailed expense data, including categories (e.g., rent, supplies, labor) and amounts, as a JSON string.'
    ),
  salesData: z
    .string()
    .describe(
      'Detailed sales data, including categories (e.g., coffee, pastries, merchandise) and amounts, as a JSON string.'
    ),
});
export type CostAnalysisInput = z.infer<typeof CostAnalysisInputSchema>;

const CostAnalysisOutputSchema = z.object({
  summary: z.string().describe('A summary of the cost analysis.'),
  keyCostDrivers: z
    .array(z.string())
    .describe('List of the most impactful cost drivers on profits.'),
  recommendations: z
    .array(z.string())
    .describe('Recommendations for cost management.'),
});
export type CostAnalysisOutput = z.infer<typeof CostAnalysisOutputSchema>;

export async function analyzeCosts(input: CostAnalysisInput): Promise<CostAnalysisOutput> {
  return costAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'costAnalysisPrompt',
  input: {schema: CostAnalysisInputSchema},
  output: {schema: CostAnalysisOutputSchema},
  prompt: `You are an expert financial analyst specializing in cost management for coffee shops.

You will analyze the provided expense and sales data to identify the most impactful costs on profits and provide recommendations for cost management.

Expense Data: {{{expensesData}}}
Sales Data: {{{salesData}}}

Analyze the data and provide:
1. A concise summary of the cost analysis.
2. A list of the key cost drivers that have the most significant impact on profits.
3. Actionable recommendations for cost management, such as negotiating with suppliers, reducing waste, or optimizing staffing levels.

Ensure the output is clear, concise, and actionable for a coffee shop owner.

Here's an example of the output format:
{
  "summary": "Total expenses were $X, with the largest expense categories being rent ($Y) and labor ($Z). Sales totaled $W.",
  "keyCostDrivers": ["Rent", "Labor", "Supplies"],
  "recommendations": ["Negotiate rent with landlord", "Optimize staffing levels during slow periods", "Reduce waste of perishable goods"]
}
`,
});

const costAnalysisFlow = ai.defineFlow(
  {
    name: 'costAnalysisFlow',
    inputSchema: CostAnalysisInputSchema,
    outputSchema: CostAnalysisOutputSchema,
  },
  async input => {
    try {
      // Parse the JSON strings into objects
      const expenses = JSON.parse(input.expensesData);
      const sales = JSON.parse(input.salesData);
      // Basic validation, though zod schema should prevent this
      if (!expenses || !sales) {
        throw new Error(
          'Invalid expense or sales data.  Ensure they are valid JSON strings.'
        );
      }

      const {output} = await prompt(input);

      return output!;
    } catch (error: any) {
      console.error('Error during cost analysis:', error);
      throw new Error(`Cost analysis failed: ${error.message}`);
    }
  }
);

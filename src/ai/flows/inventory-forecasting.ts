// src/ai/flows/inventory-forecasting.ts
'use server';

/**
 * @fileOverview A flow for predicting inventory needs based on sales data.
 *
 * - inventoryForecasting - Predicts inventory requirements based on historical sales data.
 * - InventoryForecastingInput - The input type for the inventoryForecasting function.
 * - InventoryForecastingOutput - The return type for the inventoryForecasting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InventoryForecastingInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      'Historical sales data including dates, item names, and quantities sold.'
    ),
  peakSeasons: z
    .string()
    .describe(
      'Information on peak seasons and holidays that affect sales volume.'
    ),
  leadTimeDays: z
    .number()
    .describe(
      'The number of days it takes to receive a new inventory shipment.'
    ),
  currentStockLevels: z
    .string()
    .describe('Current stock levels for each item.'),
});
export type InventoryForecastingInput = z.infer<typeof InventoryForecastingInputSchema>;

const InventoryForecastingOutputSchema = z.object({
  predictedInventoryNeeds: z
    .string()
    .describe(
      'Predicted quantities needed for each item, along with the reasoning behind the prediction.'
    ),
  notificationMessage: z
    .string()
    .describe(
      'A message indicating when to reorder items and the suggested quantities.'
    ),
});
export type InventoryForecastingOutput = z.infer<typeof InventoryForecastingOutputSchema>;

export async function inventoryForecasting(input: InventoryForecastingInput): Promise<InventoryForecastingOutput> {
  return inventoryForecastingFlow(input);
}

const inventoryForecastingPrompt = ai.definePrompt({
  name: 'inventoryForecastingPrompt',
  input: {schema: InventoryForecastingInputSchema},
  output: {schema: InventoryForecastingOutputSchema},
  prompt: `You are an AI assistant that helps coffee shop owners manage their inventory.

  Based on the historical sales data, peak seasons, lead time and current stock levels, predict the required quantities of each item (coffee beans, milk, sugar etc.) and notify the user before they run out of stock. Also, include a reason for the predicted quantities.

  Historical Sales Data: {{{salesData}}}
  Peak Seasons and Holidays: {{{peakSeasons}}}
  Lead Time (Days): {{{leadTimeDays}}}
  Current Stock Levels: {{{currentStockLevels}}}

  Provide the predicted inventory needs and a notification message indicating when to reorder items and the suggested quantities.
  Follow the output schema.
  `,
});

const inventoryForecastingFlow = ai.defineFlow(
  {
    name: 'inventoryForecastingFlow',
    inputSchema: InventoryForecastingInputSchema,
    outputSchema: InventoryForecastingOutputSchema,
  },
  async input => {
    const {output} = await inventoryForecastingPrompt(input);
    return output!;
  }
);

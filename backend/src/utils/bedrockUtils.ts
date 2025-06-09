import { invokeBedrock } from '../services/awsService'

export async function generateScrapedDataPrompt(scrapedData: string, schema: string): Promise<string> {

  const promptText = "Summarise the scraped data based on the provided schema. Return only valid JSON format. You may need multiple JSON objects to represent the data which should be placed in a list. Ensure the response contains no additional text, explanations, or comments—just the JSON object:";

  const prompt = `${promptText}\n\nScraped Data:\n[${scrapedData}]\n\nSchema:\n\`\`\`\n${(schema)}\n\`\`\`\n\nJSON Response:`;

  const response = await invokeBedrock(
        prompt,
        10000,
        1,
        0.8
      )
  return response;
}
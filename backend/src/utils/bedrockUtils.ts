import { exportSchemas } from './dbUtils'

export function generateFormatDataPrompt(scrapedData: string, schema: string): string {

  const prefix = "Summarise the scraped data based on the provided schema. Return only valid JSON format. You may need multiple JSON objects to represent the data which should be placed in a list. Any empty fields should be represented as null Ensure the response contains no additional text, explanations, or comments—just the JSON object:";

  const prompt = `${prefix}\n\nScraped Data:\n[${scrapedData}]\n\nSchema:\n\`\`\`\n${(schema)}\n\`\`\`\n\nJSON Response:`;

  return prompt;
}

export function generateSafiPrompt(user_prompt: string): string {
  
  const prefix  = "You are a helpful assistant.";

  const prompt = `${prefix}\n\User prompt:\n[${user_prompt}]\n\nSchema:\n\`\`\`\n${(exportSchemas())}\n\`\`\`\n\nJSON Response:`;

  return prompt;
}
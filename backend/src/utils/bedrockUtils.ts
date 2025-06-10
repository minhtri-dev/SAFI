export function generateFormatDataPrompt(scrapedData: string, schema: string): string {

  const promptText = "Summarise the scraped data based on the provided schema. Return only valid JSON format. You may need multiple JSON objects to represent the data which should be placed in a list. Any empty fields should be represented as null Ensure the response contains no additional text, explanations, or comments—just the JSON object:";

  const prompt = `${promptText}\n\nScraped Data:\n[${scrapedData}]\n\nSchema:\n\`\`\`\n${(schema)}\n\`\`\`\n\nJSON Response:`;

  return prompt;
}

export function generateSafiPrompt(user_prompt: string, chat_history: string[]): string {
  
  const response = ''
  return response;
}
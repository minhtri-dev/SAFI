// import { exportSchemas } from './dbUtils'
import { FoodRetailerType, getParser } from '../models/FacilityModel2'
import { client, invokeBedrock } from '../services/awsService'
import { getScrapedResults } from './scraperUtils'


// export function generateFormatDataPrompt(scrapedData: string, schema: string): string {

//   const prefix = "Summarise the scraped data based on the provided schema. Return only valid JSON format. You may need multiple JSON objects to represent the data which should be placed in a list. Any empty fields should be represented as null Ensure the response contains no additional text, explanations, or comments—just the JSON object:";

//   const prompt = `${prefix}\n\nScraped Data:\n[${scrapedData}]\n\nSchema:\n\`\`\`\n${(schema)}\n\`\`\`\n\nJSON Response:`;

//   return prompt;
// }

// export function generateSafiPrompt(user_prompt: string): string {
  
//   const prefix  = "You are a helpful assistant.";

//   const prompt = `${prefix}\n\User prompt:\n[${user_prompt}]\n\nSchema:\n\`\`\`\n${(exportSchemas())}\n\`\`\`\n\nJSON Response:`;

//   return prompt;
// }


export async function formatScrapedData(facility: 'FoodRetailer' | 'StudySpace', data: object): Promise<FoodRetailerType[]> {

  //TODO: Use a more advanced model for data scraping
  const parser = getParser(facility)

  const prompt = `You are tasked with collecting information about food retailers from the RMIT website. 
  Your goal is to gather and structure data about each retailer according to the following schema. 
  Ensure the response contains no additional text, explanations, or comments—just the JSON object:

  ${parser.getFormatInstructions()}
  
  Scraped data:
  ${JSON.stringify(data)}
  `

  const model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0'

  const response = await invokeBedrock(prompt, 4096, 1, 0.8, model_id)

  return parser.parse(response as string)
}
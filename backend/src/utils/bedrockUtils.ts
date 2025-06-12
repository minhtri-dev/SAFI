import { FoodRetailerType, getParser } from '../models/FacilityModel'
import { invokeBedrock } from '../services/awsService'

export async function formatScrapedData(
  facility: 'FoodRetailer' | 'StudySpace',
  data: object,
): Promise<FoodRetailerType[]> {
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

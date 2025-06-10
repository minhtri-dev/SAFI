import { StudySpaceType, FoodRetailerType } from '../models/FacilityModel'
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb'
// import { BedrockEmbeddings } from "@langchain/aws";
import { OpenAIEmbeddings } from '@langchain/openai'

import { getScrapedResults } from '../utils/scraperUtils'
import { getDatabase } from '../services/dbService'
import { formatScrapedData } from '../utils/bedrockUtils'
// import { FoodRetailerType } from '../models/FacilityModel2'
import config from '../config/awsConfig'
import { pipeline } from '@xenova/transformers'

const {
  REGION,
  MODEL_ID,
  IDENTITY_POOL_ID,
  USER_POOL_ID,
  APP_CLIENT_ID,
  USERNAME,
  PASSWORD,
} = config

export async function createStudySpaceSummary(
  studySpace: StudySpaceType,
): Promise<string> {
  return new Promise((resolve) => {
    const basicInfo = `${studySpace.name}, located at ${studySpace.location}`
    const campus = studySpace.campus
      ? `Campus: ${studySpace.campus}`
      : 'Campus: Not specified'
    const description = `Description: ${studySpace.description}`
    const keywords = studySpace.key_words
      ? `Keywords: ${studySpace.key_words.join(', ')}`
      : 'No keywords provided'
    const contact = studySpace.contact_details
      ? `Contact: Email - ${studySpace.contact_details.email ?? 'N/A'}, Phone - ${studySpace.contact_details.phone_number ?? 'N/A'}`
      : 'No contact details available'

    const studyRoomType = `Room Type: ${studySpace.study_room_type}`
    const amenities = studySpace.amenities
      ? `Amenities: ${studySpace.amenities.join(', ')}`
      : 'No amenities listed'
    const additionalInfo = studySpace.additional_info
      ? `Additional Info: ${JSON.stringify(studySpace.additional_info)}`
      : 'No additional information'

    const summary = `${basicInfo}. ${campus}. ${description}. ${keywords}. ${contact}. ${studyRoomType}. ${amenities}. ${additionalInfo}`
    resolve(summary)
  })
}

export async function createFoodRetailerSummary(
  foodRetailer: FoodRetailerType,
): Promise<string> {
  return new Promise((resolve) => {
    const basicInfo = `${foodRetailer.name}, located at ${foodRetailer.location}`
    const campus = foodRetailer.campus
      ? `Campus: ${foodRetailer.campus}`
      : 'Campus: Not specified'
    const description = `Description: ${foodRetailer.description}`
    const keywords = foodRetailer.key_words
      ? `Keywords: ${foodRetailer.key_words.join(', ')}`
      : 'No keywords provided'
    const contact = foodRetailer.contact_details
      ? `Contact: Email - ${foodRetailer.contact_details.email ?? 'N/A'}, Phone - ${foodRetailer.contact_details.phone_number ?? 'N/A'}`
      : 'No contact details available'

    const urls = foodRetailer.urls
      ? `URLs: ${foodRetailer.urls.join(', ')}`
      : 'No URLs provided'
    const additionalInfo = foodRetailer.additional_info
      ? `Additional Info: ${JSON.stringify(foodRetailer.additional_info)}`
      : 'No additional information'

    const summary = `${basicInfo}. ${campus}. ${description}. ${keywords}. ${contact}. ${urls}. ${additionalInfo}`
    resolve(summary)
  })
}

const facilitySummaryFunctions: Record<
  string,
  (record: any) => Promise<string>
> = {
  'Food Retailer': createFoodRetailerSummary,
  StudySpace: createStudySpaceSummary,
}

const facilityMapping: Record<string, 'FoodRetailer' | 'StudySpace'> = {
  'Food Retailer': 'FoodRetailer',
  'Study Space': 'StudySpace',
}

import { type EmbeddingsInterface } from '@langchain/core/embeddings'

// Provided reference, but modified to return an array of embeddings.
export async function getEmbedding(data: string[]): Promise<number[][]> {
  try {
    // Initialise the feature extraction pipeline
    const extractor = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    )
    // Extract features, with options for pooling and normalisation.
    const response = await extractor(data, { pooling: 'mean', normalize: true })
    // Return the response.data directly (assuming it's already structured as an array of embeddings)
    return response.tolist()
  } catch (error) {
    console.error('Error fetching embeddings:', error)
    throw new Error('Failed to get embeddings')
  }
}

// Custom embeddings class implementing the expected API using EmbeddingsInterface.
export class Embeddings implements EmbeddingsInterface {
  // Embeds an array of texts to an array of embeddings.
  async embedDocuments(texts: string[]): Promise<number[][]> {
    return getEmbedding(texts)
  }

  // Embeds a single query string.
  async embedQuery(text: string): Promise<number[]> {
    const embeddings = await getEmbedding([text])
    // Return the first embedding from the array.
    return embeddings[0]
  }
}
export async function insertScrapeData(): Promise<void> {
  if (
    !REGION ||
    !MODEL_ID ||
    !IDENTITY_POOL_ID ||
    !USER_POOL_ID ||
    !APP_CLIENT_ID ||
    !USERNAME ||
    !PASSWORD
  ) {
    throw new Error(
      'AWS configuration is incomplete. Please check your environment variables.',
    )
  }
  // Scrape data
  const _scrapedData = await getScrapedResults()
  const db = getDatabase()

  await Promise.all(
    _scrapedData.map(async (facility) => {
      for (const _name in facility) {
        const { data } = facility[_name]
        const collection = db.collection('Facility')
        const records = await formatScrapedData(facilityMapping[_name], data)

        const summaryFunction = facilitySummaryFunctions[_name]
        const recordsWithSummaries = await Promise.all(
          records.map(async (record) => ({
            pageContent: await summaryFunction(record),
            metadata: { ...record },
          })),
        )

        for (const record of recordsWithSummaries) {
          await MongoDBAtlasVectorSearch.fromDocuments(
            [record],
            new Embeddings(),
            {
              collection,
              indexName: 'vector_index',
              textKey: 'embedding_text',
              embeddingKey: 'embedding',
            },
          )
        }
      }
    }),
  )
}

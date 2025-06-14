import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { FacilityEmbeddings } from '../services/embeddingsService'
import { getScrapedResults } from '../utils/scraperUtils'
import { formatScrapedData } from '../utils/bedrockUtils'
import { getDatabase } from '../services/dbService'

import { StudySpaceType, FoodRetailerType } from '../models/FacilityModel'
import config from '../config/awsConfig'

const {
  REGION,
  MODEL_ID,
  IDENTITY_POOL_ID,
  USER_POOL_ID,
  APP_CLIENT_ID,
  USERNAME,
  PASSWORD,
} = config

const vectorStore = new HNSWLib(new FacilityEmbeddings(), {space: 'cosine', numDimensions: 384}) 

interface FacilitySummaryFunctions {
  'Food Retailers': (record: FoodRetailerType, name: string) => Promise<string>
  'Study Spaces': (record: StudySpaceType, name: string) => Promise<string>
}

const facilitySummaryFunctions: FacilitySummaryFunctions = {
  'Food Retailers': createFoodRetailerSummary,
  'Study Spaces': createStudySpaceSummary,
}

const facilityMapping: Record<string, 'FoodRetailer' | 'StudySpace'> = {
  'Food Retailers': 'FoodRetailer',
  'Study Spaces': 'StudySpace',
}

export async function createStudySpaceSummary(
  studySpace: StudySpaceType,
  facilityType: string
): Promise<string> {
  return new Promise((resolve) => {
    const facilityName = `Facility Type: ${facilityType}`
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

    const summary = `${facilityName}.${basicInfo}. ${campus}. ${description}. ${keywords}. ${contact}. ${studyRoomType}. ${amenities}. ${additionalInfo}`
    resolve(summary)
  })
}

export async function createFoodRetailerSummary(
  foodRetailer: FoodRetailerType,
  facilityType: string
): Promise<string> {
  return new Promise((resolve) => {
    const facilityName = `Facility Type: ${facilityType}`
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

    const summary = `${facilityName}, ${basicInfo}. ${campus}. ${description}. ${keywords}. ${contact}. ${urls}. ${additionalInfo}`
    resolve(summary)
  })
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
      'AWS configuration is incomplete. Please check your environment variables.'
    )
  }
  // Scrape data
  const _scrapedData = await getScrapedResults()
  // Get the database (if needed for other operations)
  const db = getDatabase()

  // For each facility type in scraped data, create a vector store using HNSWLib
  await Promise.all(
  _scrapedData.map(async (facility) => {
    for (const _name in facility) {
      const { data } = facility[_name]
      const collection = db.collection('Facility')
      const records = await formatScrapedData(facilityMapping[_name], data)
      const summaryFunction =
        facilitySummaryFunctions[_name as keyof FacilitySummaryFunctions]

      const recordsWithSummaries = await Promise.all(
        records.map(async (record: StudySpaceType | FoodRetailerType) => {
          let pageContent: string = ''
          // Use a switch-case to allow adding new facility types in future
          switch (_name) {
            case 'Study Spaces':
              pageContent = await (
                summaryFunction as (record: StudySpaceType, name: string) => Promise<string>
              )(record as StudySpaceType, _name)
              break
            case 'Food Retailers':
              pageContent = await (
                summaryFunction as (record: FoodRetailerType, name: string) => Promise<string>
              )(record as FoodRetailerType, _name)
              break
            default:
              // For facility types added in the future, provide a default summary
              pageContent = 'Summary not available'
              break
          }
          return {
            pageContent,
            metadata: { ...record, facility_type: _name },
          }
        })
      )
      
      // Insert raw records into the collection
      await collection.insertMany(records)
      // Add processed documents to the vector store
      await vectorStore.addDocuments(recordsWithSummaries)
    }
  })
)
}


export function getVectorStore(): HNSWLib {
  return vectorStore
}
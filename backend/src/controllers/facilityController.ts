import { Request, Response } from 'express'

import { getScrapedResults } from '../utils/scraperUtils'
import { generateFormatDataPrompt } from '../utils/bedrockUtils'
import { FoodRetailerFacility, StudySpaceFacility } from '../models/FacilityModel'
import { invokeBedrock as invoke } from '../services/awsService'
import SchemaDetails from '../models/SchemaDetailsModel'

type FacilityName = "FoodRetailerFacility" | "StudySpaceFacility";

const Facility: Record<FacilityName, any> = {
  "FoodRetailerFacility": FoodRetailerFacility,
  "StudySpaceFacility": StudySpaceFacility
  // "Health Clinic": HealthClinicFacility
};

export const updateWithScapeData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Scrape data
    const _scrapedData = await getScrapedResults()

    await Promise.all(
      _scrapedData.map(async facility => {
        for (const _name in facility) {
          const { data } = facility[_name];

          // Grab schema
          const schemaDetails = (await SchemaDetails.findOne({ name: _name }))?.schemaDetails;
          const {__v, _id, type, scrapedAt, ...simpleSchema } = schemaDetails

          // Get JSON response
          const prompt = generateFormatDataPrompt(JSON.stringify(data), JSON.stringify(simpleSchema))
          const response = JSON.parse(await invoke(prompt, 10000, 1, 0.8))

          // Insert into collections
          await Facility[_name as FacilityName].insertMany(response)
        }
      })
    );

    res.status(200).send('Data updated successfully')

  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating Database')
  }
}
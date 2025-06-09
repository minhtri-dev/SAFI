import { Request, Response } from 'express'

import { getScrapedResults } from '../utils/scraperUtils'
import { generateScrapedDataPrompt } from '../utils/bedrockUtils'
import { FoodRetailerFacility } from '../models/FacilityModel'
import SchemaDetails from '../models/SchemaDetailsModel'

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

          const response = await generateScrapedDataPrompt(JSON.stringify(data), JSON.stringify(simpleSchema))
          await FoodRetailerFacility.insertMany(JSON.parse(response))
          
        }
      })
    );

    res.status(200).send('Data updated successfully')

  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating Database')
  }
}
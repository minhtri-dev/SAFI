import { Request, Response } from 'express'

import { exportSchemasToJson } from '../utils/dbUtils'
import { getScrapedResults } from '../utils/scraperUtils'
import { invokeBedrock } from '../services/awsService'
// import Facility from '../models/FacilityModel'

interface Iprompt {
  prompt: string
  scrapedData: object
  schemas: object
}

export const updateWithScapeData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Scrape data
    const _scrapedData = await getScrapedResults()
    // const _scrapedData = { FoodRetailer: "Tokyo Yokocho x Taiyo Sun Location: Building 14, Level 4, Room 136 Tokyo Yokocho is produced and supervised by an established Japanese restaurant chain, Shimbashi Soba's chef owner, Takafumi Kumayama. This pocket-friendly store is aimed to offer delicious and healthy Japanese food to the RMIT's students and staff, with quick service! Taiyo Sun is an authentic Japanese Kissaten (cafe) specialised in Matcha tea and thick-cut shokupan bread. On the RMIT campus, you'll find Japanese style sweets such as matcha soft serve, affogato, matcha shokupan toast with azuki. Taiyo Sun created drinks such as the matchaccino, strawberry matcha latte and authentic Japanese matcha/hojicha latte are also on offer. Opening hours:Tokyo Yokocho - Monday – Friday, 11am to 3pmTaiyo Sun -  Monday – Friday, 8.30am to 3pm"}
    
    const schemas = JSON.parse(exportSchemasToJson())

    const prompt_text = "Summarise scraped data based on the provided schema. Ignore the '_id' and '__v' fields. Set any unknown fields to null. Keep the descriptions no more than 20 words. Return valid JSON:"

    // const prompt: Iprompt = {
    //   prompt: prompt_text,
    //   scrapedData: scrapedData,
    //   schemas: schemas
    // };

    // const prompt: Iprompt = {
    //   prompt: prompt_text,
    //   scrapedData: _scrapedData,
    //   schemas: {
    //     "scrapedAt":{"type":"Date","required":false},
    //     "campus":{"type":"String","required":false},
    //     "location":{"type":"String","required":false},
    //     "description":{"type":"String","required":false},"openingHours":{"type":"String","required":false},
    //     "contact":{"type":"String","required":false},"_id":{"type":"ObjectId","required":false},
    //     "name":{"type":"String","required":true},
    //     "retailLocation":{"type":"String","required":false},
    //     "keywords":{"type":"String","required":false},"__v":{"type":"Number","required":false},
    //     "type":{"type":"String","required":false}}
    // };

    const prompt = prompt_text + "\n\n" +
    "Scraped Data: " + JSON.stringify(_scrapedData) + "\n\n" +
    "Schema: \n```\n\n" + JSON.stringify({
        "retailName":{"type":"String","required":true},
        "campus":{"type":"String","required":true},
        "description":{"type":"String","required":true},
        "openingHours":{"type":"String","required":true},
        "contact":{"type":"String","required":false},
        "retailLocation":{"type":"String","required":true},
        "keywords":{"type":"Array","required":true}}) +  "\n```\n\n" +
    " JSON Response:"

    // Call AWS bedrock
    const response = await invokeBedrock(
          prompt,
          10000,
          1,
          0.8
        )
        res.json({
          response,
        })

    console.log(JSON.parse(response))
    // await insertMany(text)

  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating Database')
  }
}
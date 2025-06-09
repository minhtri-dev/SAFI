import { Request, Response } from 'express'

import { exportSchemasToJson } from '../utils/dbUtils'
import { getScrapedResults } from '../utils/scraperUtils'
import { invokeBedrock } from '../services/awsService'
import { FoodRetailerFacility } from '../models/FacilityModel'

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

    const prompt_text = "Summarise the scraped data based on the provided schema. Exclude the fields '_id' and '__v'. Return only valid JSON formatted data. Ensure the response contains no additional text, explanations, or comments—just the JSON object:"

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
        "retailName":{"type":"String","required":true, "description": "Name of the food retailer", "example": "Tokyo Yokocho x Taiyo Sun"},
        "campus":{"type":"String","required":true, "description": "Name of campus", "example": "City Campus"},
        "description":{"type":"String","required":true, "description": "Short 10-20 word description", "example": "Located in the heart of Melbourne's CBD The Oxford Scholar provides award winning parmas, private dining options, professional events, or an enjoyable night out."},
        "openingHours":{"type":"String","required":true, "description": "Hours of operation", "example:": "Monday to Friday, 11am to 3pm"},
        "contact":{"type":"Array","required":false,  "description": "Methods of contact, only input valid emails and phone numbers ", "example:": ["example@gmail.com", "0412 345 678"]},
        "retailLocation":{"type":"String","required":true,  "description": "Location of food retailer", "example:": "Building 80, and Building 14 Level 4 Room 141"},
        "keywords":{"type":"Array","required":true, "description": "Keywords 1 to 3 words", "example:": [ 'Japanese', 'Cafe', 'Matcha' ]}}) +  "\n```\n\n" +
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
    await FoodRetailerFacility.insertMany(JSON.parse(response))

  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating Database')
  }
}
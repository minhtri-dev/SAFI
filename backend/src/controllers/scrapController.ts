import { Request, Response } from 'express'
import { getScrapedResults } from '../utils/scraperUtils'

export const scrapeData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const results = await getScrapedResults()

    res.json(results)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error scraping data')
  }
}

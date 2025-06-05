import { Request, Response } from 'express'
import { scraper } from '../utils/scraperUtils'
import scrapeConfig from '../config/scrapeConfig.json'

export const scrapeData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const results = await Promise.all(
      scrapeConfig.map(async (config) => {
        const selectors =
          config.selectors || (config.selectors ? [config.selectors] : [])
        const scrapedData = await scraper(config.url, selectors)
        return { url: config.url, data: scrapedData }
      }),
    )

    res.json(results)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error scraping data')
  }
}

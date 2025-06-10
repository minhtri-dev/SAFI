import { Request, Response } from 'express'
import { insertScrapeData } from '../utils/dbUtils'

export const updateWithScapeData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await insertScrapeData()

    res.status(200).send('Data updated successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating Database')
  }
}

import { Router } from 'express'
import { scrapeData } from '../controllers/scrapController'

const router = Router()

router.get('/scrape', scrapeData)

export default router

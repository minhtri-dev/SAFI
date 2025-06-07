import { Router } from 'express'
import { scrapeData } from '../controllers/scrapController'

const router = Router()

router.get('/update', scrapeData)

export default router

import { Router } from 'express'

import bedrockRoute from './bedrockRoutes'
import scrapRoute from './scrapeRoutes'
import facilityRoute from './facilityRoute'

const router = Router()

router.use(bedrockRoute)
router.use(scrapRoute)
router.use(facilityRoute)

export default router

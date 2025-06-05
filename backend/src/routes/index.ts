import { Router } from 'express'

import bedrockRoute from './bedrockRoutes'
import scrapRoute from './scrapeRoutes'

const router = Router()

router.use(bedrockRoute)
router.use(scrapRoute)

export default router

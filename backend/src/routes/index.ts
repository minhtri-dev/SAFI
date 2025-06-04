import { Router } from 'express'

import bedrockRoute from './bedrockRoutes'

const router = Router()

router.use(bedrockRoute)

export default router

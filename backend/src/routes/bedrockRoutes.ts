import { Router } from 'express'
import { invokeBedrock, safiRequest } from '../controllers/bedrockController'

const router = Router()

router.post('/invoke-bedrock', invokeBedrock)
router.post('/safi-request', safiRequest)
router.post('/safi-request/:threadId', safiRequest)

export default router

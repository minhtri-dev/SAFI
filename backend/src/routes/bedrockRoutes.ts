import { Router } from 'express'
import { invokeBedrock, safiRequest } from '../controllers/bedrockController'

const router = Router()

router.post('/invoke-bedrock', invokeBedrock)
router.post('/safi-request', safiRequest)

export default router

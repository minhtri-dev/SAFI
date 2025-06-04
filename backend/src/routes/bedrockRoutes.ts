import { Router } from 'express'
import { invokeBedrockController } from '../controllers/bedrockController'

const router = Router()

router.post('/invoke-bedrock', invokeBedrockController)

export default router

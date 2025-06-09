import { Router } from 'express'
import { invokeBedrock } from '../controllers/bedrockController'

const router = Router()

router.post('/invoke-bedrock', invokeBedrock)

export default router

import { Router } from 'express'
import { updateWithScapeData } from '../controllers/facilityController'

const router = Router()

router.get('/update', updateWithScapeData)

export default router

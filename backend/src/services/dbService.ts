import mongoose from 'mongoose'
import config from '../config/dbConfig'
import { StudySpaceFacility, SportsCentreFacility, HealthClinicFacility, FoodRetailerFacility } from '../models/FacilityModel'

const { URI, NODE_ENV } = config

export const connectDatabase = async (): Promise<void> => {
  try {
    if (URI) {
      await mongoose.connect(URI)
      console.log(`Connected to MongoDB server using defined URI: ${URI}`)
    } else if (NODE_ENV === 'development') {
      console.log('No MongoDB URI defined: Creating development MongoDB server')
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      const mongoServer = await MongoMemoryServer.create()
      const uri = mongoServer.getUri()
      await mongoose.connect(uri)
      console.log(`Connected to development MongoDB server: ${uri}`)
    } else {
      throw new Error(
        'No MongoDB URI defined and not in development mode. Please check environment variables.',
      )
    }
  } catch (error) {
    console.error(
      `Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`,
    )
    process.exit(1)
  }
}

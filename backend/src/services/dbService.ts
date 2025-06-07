import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import config from '../config/dbConfig'

const {
  URI,
  NODE_ENV
} = config

export const connectDatabase = async () => {
  if (NODE_ENV === 'development') {
    const mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
    console.log('Connected to development MongoDB server')
  } else if (NODE_ENV === 'production' && URI !== undefined) {
    await mongoose.connect(URI)
    console.log('Connected to production MongoDB server')
  }
  else {
    throw new Error('MongoDB URI is not defined in the environment variables')
  }
}
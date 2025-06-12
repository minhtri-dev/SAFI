import { MongoClient } from 'mongodb'
import config from '../config/dbConfig'

const { URI, NODE_ENV, DB_NAME } = config
let client: MongoClient

export const connectDatabase = async (): Promise<MongoClient> => {
  try {
    if (URI) {
      client = new MongoClient(URI)
      await client.connect()
      console.log(`Connected to MongoDB server using defined URI: ${URI}`)
    } else if (NODE_ENV === 'development') {
      console.log('No MongoDB URI defined: Creating development MongoDB server')
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      const mongoServer = await MongoMemoryServer.create()
      const uri = mongoServer.getUri()
      client = new MongoClient(uri)
      await client.connect()
      console.log(`Connected to development MongoDB server: ${uri}`)
    } else {
      throw new Error(
        'No MongoDB URI defined and not in development mode. Please check environment variables.',
      )
    }

    // Return the connected client
    return client
  } catch (error) {
    console.error(
      `Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`,
    )
    process.exit(1)
  }
}

export const getDatabase = () => {
  if (!client) {
    throw new Error('Database not connected!')
  }
  return client.db(DB_NAME)
}

export const getMongoClient = () => {
  return client
}

// Handle cleanup and close the database connection
const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}. Closing MongoDB client.`)
  if (client) {
    client.close().then(() => {
      console.log('MongoDB client closed.')
      process.exit(0)
    })
  } else {
    process.exit(0)
  }
}

// Listen for termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

import express from 'express'
import cors from 'cors'
import routes from './routes'

import { errorHandler } from './middlewares/errorHandler'
import { connectDatabase } from './services/dbService'
// import { insertSchemasIntoCollection } from './utils/dbUtils'
import { MongoClient } from 'mongodb'

import { insertScrapeData } from './utils/dbUtils'

import config from './config/dbConfig'

const { DB_NAME } = config

const app = express()

;(async () => {
  try {
    const client: MongoClient = await connectDatabase()

    await insertScrapeData()
    const collection = client.db(DB_NAME).collection('Facility')

    await collection.deleteMany({})

    // Check if the index already exists
    const existingIndexes = await collection.indexes()
    const indexExists = existingIndexes.some(
      (index) => index.name === 'vector_index',
    )

    if (!indexExists) {
      const index = {
        name: 'vector_index',
        type: 'vectorSearch',
        definition: {
          fields: [
            {
              type: 'vector',
              numDimensions: 384,
              path: 'embeddings',
              similarity: 'cosine',
            },
          ],
        },
      }

      // Create the index if it doesn't exist
      await collection.createSearchIndex(index)
    }

    app.use(express.json())

    app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    )

    app.use('/api', routes)

    app.use(errorHandler)
  } catch (error) {
    console.error('Could not connect to database:', error)
    process.exit(1)
  }
})()

export default app

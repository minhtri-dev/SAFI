import express from 'express'
import cors from 'cors'
import routes from './routes'

import { errorHandler } from './middlewares/errorHandler'
import { connectDatabase } from './services/dbService'

const app = express()

connectDatabase()

app.use(express.json())

app.use('/api', routes)

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
app.use(errorHandler)

export default app

import dotenv from 'dotenv'

dotenv.config()

interface dbConfig {
  URI: string | undefined
  NODE_ENV: string | undefined
  DB_NAME: string | undefined
}

const dbConfig: dbConfig = {
  URI: process.env.MONGO_URI || undefined,
  NODE_ENV: process.env.NODE_ENV || undefined,
  DB_NAME: process.env.MONGO_NAME || 'SafiDB'
}

export default dbConfig

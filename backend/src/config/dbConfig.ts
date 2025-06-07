import dotenv from 'dotenv'

dotenv.config()

interface dbConfig {
  URI: string | undefined,
  NODE_ENV: string | undefined,
}

const dbConfig: dbConfig = {
  URI: process.env.MONGO_URL || undefined,
  NODE_ENV: process.env.NODE_ENV || undefined,
}

export default dbConfig

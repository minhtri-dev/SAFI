import dotenv from 'dotenv'

dotenv.config()

interface awsConfig {
  REGION: string | null
  MODEL_ID: string | null
  IDENTITY_POOL_ID: string | null
  USER_POOL_ID: string | null
  APP_CLIENT_ID: string | null
  USERNAME: string | null
  PASSWORD: string | null
}

const awsConfig: awsConfig = {
  REGION: process.env.AWS_REGION || null,
  MODEL_ID: process.env.AWS_MODEL_ID || null,
  IDENTITY_POOL_ID: process.env.AWS_IDENTITY_POOL_ID || null,
  USER_POOL_ID: process.env.AWS_USER_POOL_ID || null,
  APP_CLIENT_ID: process.env.AWS_APP_CLIENT_ID || null,
  USERNAME: process.env.AWS_USERNAME || null,
  PASSWORD: process.env.AWS_PASSWORD || null,
}

export default awsConfig

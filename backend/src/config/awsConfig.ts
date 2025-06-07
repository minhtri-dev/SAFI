import dotenv from 'dotenv'

dotenv.config()

interface awsConfig {
  REGION: string | undefined
  MODEL_ID: string | undefined
  IDENTITY_POOL_ID: string | undefined
  USER_POOL_ID: string | undefined
  APP_CLIENT_ID: string | undefined
  USERNAME: string | undefined
  PASSWORD: string | undefined
}

const awsConfig: awsConfig = {
  REGION: process.env.AWS_REGION || undefined,
  MODEL_ID: process.env.AWS_MODEL_ID || undefined,
  IDENTITY_POOL_ID: process.env.AWS_IDENTITY_POOL_ID || undefined,
  USER_POOL_ID: process.env.AWS_USER_POOL_ID || undefined,
  APP_CLIENT_ID: process.env.AWS_APP_CLIENT_ID || undefined,
  USERNAME: process.env.AWS_USERNAME || undefined,
  PASSWORD: process.env.AWS_PASSWORD || undefined,
}

export default awsConfig

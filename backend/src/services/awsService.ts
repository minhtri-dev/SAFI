import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'

import {
  CognitoIdentityClient,
  GetIdCommand,
  GetIdCommandInput,
  GetCredentialsForIdentityCommand,
  GetCredentialsForIdentityCommandInput,
  Credentials,
} from '@aws-sdk/client-cognito-identity'

// TODO: Delete these imports 
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from '@aws-sdk/client-bedrock-runtime'


import { Bedrock } from "@langchain/community/llms/bedrock";

import config from '../config/awsConfig'

const {
  REGION,
  MODEL_ID,
  IDENTITY_POOL_ID,
  USER_POOL_ID,
  APP_CLIENT_ID,
  USERNAME,
  PASSWORD,
} = config

// Helper function to get temporary AWS credentials via Cognito
export async function getCredentials(
  username: string,
  password: string,
): Promise<Credentials> {
  try {
    if (
      !REGION ||
      !MODEL_ID ||
      !IDENTITY_POOL_ID ||
      !USER_POOL_ID ||
      !APP_CLIENT_ID ||
      !USERNAME ||
      !PASSWORD
    ) {
      throw new Error(
        'AWS configuration is incomplete. Please check your environment variables.',
      )
    }
    const idpClient = new CognitoIdentityProviderClient({
      region: REGION,
    })

    const authParams: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      ClientId: APP_CLIENT_ID,
    }

    const authResponse: InitiateAuthCommandOutput = await idpClient.send(
      new InitiateAuthCommand(authParams),
    )

    const idToken = authResponse.AuthenticationResult?.IdToken
    if (!idToken) throw new Error('Failed to retrieve ID token.')

    const identityClient = new CognitoIdentityClient({
      region: REGION,
    })

    const getIdParams: GetIdCommandInput = {
      IdentityPoolId: IDENTITY_POOL_ID,
      Logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
      },
    }

    const identityResponse = await identityClient.send(
      new GetIdCommand(getIdParams),
    )

    const getCredsParams: GetCredentialsForIdentityCommandInput = {
      IdentityId: identityResponse.IdentityId!,
      Logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
      },
    }

    const credsResponse = await identityClient.send(
      new GetCredentialsForIdentityCommand(getCredsParams),
    )

    if (!credsResponse.Credentials) {
      throw new Error('Failed to obtain temporary credentials.')
    }

    return credsResponse.Credentials
  } catch (error) {
    console.error('Error getting credentials:', error)
    throw new Error('Failed to get credentials')
  }
}

// Function to invoke a Bedrock model
export async function invokeBedrock(
  prompt_text: string,
  max_tokens: number = 640,
  temperature: number = 0.3,
  top_p: number = 0.9,
): Promise<string> {
  try {
    if (
      !REGION ||
      !MODEL_ID ||
      !IDENTITY_POOL_ID ||
      !USER_POOL_ID ||
      !APP_CLIENT_ID ||
      !USERNAME ||
      !PASSWORD
    ) {
      throw new Error(
        'AWS configuration is incomplete. Please check your environment variables.',
      )
    }
    const credentials = await getCredentials(USERNAME, PASSWORD)

    const bedrockRuntime = new BedrockRuntimeClient({
      region: REGION,
      credentials: {
        accessKeyId: credentials.AccessKeyId!,
        secretAccessKey: credentials.SecretKey!,
        sessionToken: credentials.SessionToken!,
      },
    })

    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens,
      temperature,
      top_p,
      messages: [
        {
          role: 'user',
          content: prompt_text,
        },
      ],
    }

    const input: InvokeModelCommandInput = {
      body: JSON.stringify(payload),
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
    }

    const response = await bedrockRuntime.send(new InvokeModelCommand(input))
    const result = JSON.parse(new TextDecoder('utf-8').decode(response.body))
    return result.content[0].text
  } catch (error) {
    console.error('Error in invokeBedrock:', error)
    throw new Error('Error invoking Bedrock model')
  }
}

// LangChain functions
export async function client(temperature: number, max_tokens: number | undefined): Promise<Bedrock> {
  if (
    !REGION ||
    !MODEL_ID ||
    !IDENTITY_POOL_ID ||
    !USER_POOL_ID ||
    !APP_CLIENT_ID ||
    !USERNAME ||
    !PASSWORD
  ) {
    throw new Error(
      'AWS configuration is incomplete. Please check your environment variables.',
    )
  }
  const credentials = await getCredentials(USERNAME, PASSWORD)

  return new Bedrock({
    model: MODEL_ID,
    region: REGION,
    credentials: {
      accessKeyId: credentials.AccessKeyId!,
      secretAccessKey: credentials.SecretKey!,
      sessionToken: credentials.SessionToken!,
    },
    temperature: temperature,
    maxTokens: max_tokens
  });
}

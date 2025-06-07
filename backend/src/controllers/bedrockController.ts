import { Request, Response } from 'express'
import { invokeBedrock } from '../services/awsService'

export const invokeBedrockController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { prompt_text, max_tokens, temperature, top_p } = req.body
    
    const text = await invokeBedrock(
      prompt_text,
      max_tokens,
      temperature,
      top_p,
    )
    res.json({
      text,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error invoking Bedrock')
  }
}

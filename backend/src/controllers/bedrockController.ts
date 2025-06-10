import { Request, Response } from 'express'
import { invokeBedrock as invoke } from '../services/awsService'
import { generateSafiPrompt } from '../utils/bedrockUtils'

export const invokeBedrock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { prompt_text, max_tokens, temperature, top_p } = req.body
    
    const text = await invoke(
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

export const safiRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { chat_history, ai_model, prompt_text, max_tokens, temperature, top_p } = req.body

    generateSafiPrompt(prompt_text)
    
    const text = await invoke(
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

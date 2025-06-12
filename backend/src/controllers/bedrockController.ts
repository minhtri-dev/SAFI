import { Request, Response } from 'express'
import { invokeBedrock as invoke } from '../services/awsService'

import { getAgent, invokeAgent } from '../agent/agent'

export const invokeBedrock = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { prompt_text, max_tokens, temperature, top_p } = req.body

    const text = await invoke(prompt_text, max_tokens, temperature, top_p, undefined)
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
    const { prompt, max_tokens, temperature, top_p } = req.body

    const threadIdParam = req.params.threadId
    const thread_id = threadIdParam ? threadIdParam : Date.now().toString()

    const response = await invokeAgent(prompt, thread_id)

    res.json({
      response: response,
      thread_id: thread_id
    });

  } catch (error) {
    console.error(error)
    res.status(500).send('Error invoking Bedrock')
  }
}

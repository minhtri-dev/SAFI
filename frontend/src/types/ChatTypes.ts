export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatHistory {
  messages: ChatMessage[]
  meta_data: {
    thread_id: string
    last_saved: string
  }
}

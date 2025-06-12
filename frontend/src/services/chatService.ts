import type { ChatHistory, ChatMessage } from 'types/ChatTypes'

export const saveChatHistory = (
  threadId: string,
  chatHistory: ChatHistory,
): void => {
  localStorage.setItem(`chat_${threadId}`, JSON.stringify(chatHistory))
}

export const getChatHistory = (threadId: string): ChatHistory => {
  const chatHistory = localStorage.getItem(`chat_${threadId}`)
  if (!chatHistory) {
    throw new Error(`No chat history found for thread ID: ${threadId}`)
  }

  const _chatHistory: ChatHistory = JSON.parse(chatHistory)

  return _chatHistory
}

export const getChatMessages = (threadId: string): ChatMessage[] => {
  const chatHistory = getChatHistory(threadId)
  return chatHistory.messages
}

export const clearChatHistory = (threadId: string): void => {
  localStorage.removeItem(`chat_${threadId}`)
}

export const getAllChats = (): ChatHistory[] => {
  const allHistories: ChatHistory[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)

    if (key && key.startsWith('chat_')) {
      const chatHistory = localStorage.getItem(key)

      if (chatHistory) {
        try {
          allHistories.push(JSON.parse(chatHistory))
        } catch (error) {
          console.error(`Error parsing chat history for key: ${key}`, error)
        }
      }
    }
  }

  return allHistories
}

export const isThreadInChats = (threadId: string): boolean => {
  const key = `chat_${threadId}`
  return localStorage.getItem(key) !== null
}

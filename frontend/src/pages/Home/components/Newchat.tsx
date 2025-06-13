import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { useState } from 'react'

import { saveChatHistory } from 'services/chatService'
import type { ChatHistory } from 'types/ChatTypes'
import { Loading } from '@components'

interface SafiResponse {
  thread_id: string;
  response: string;
}

const Newchat = () => {
  const navigate = useNavigate()
  const API: string = import.meta.env.VITE_EXPRESS_URL as string
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget
    const MAX_HEIGHT = 200

    target.style.height = 'auto'

    if (target.scrollHeight > MAX_HEIGHT) {
      target.style.height = `${MAX_HEIGHT}px`
      target.style.overflowY = 'scroll'
    } else {
      target.style.height = `${target.scrollHeight}px`
      target.style.overflowY = 'hidden'
    }

    setInputText(target.value)
  }

  const handleClick = async () => {
    if (!inputText.trim()) {
      return
    }

    setIsLoading(true)
    try {
      const result: AxiosResponse<SafiResponse> = await axios.post(`${API}/api/safi-request`, {
      prompt: inputText,
    });

      const threadId: string = result.data.thread_id
      const response: string = result.data.response

      const newChat: ChatHistory = {
        messages: [
          {
            role: 'user',
            content: inputText,
          },
          {
            role: 'assistant',
            content: response,
          },
        ],
        meta_data: {
          thread_id: threadId,
          last_saved: new Date().toISOString(),
        },
      }
      saveChatHistory(threadId, newChat)

      void navigate(`/${threadId}`)
    } catch (error) {
      console.error('Error making request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center">
      {isLoading && <Loading />}
      {/* Logo and title */}
      <img src="/logo.svg" width={150} />
      <h1 className="mb-3 text-2xl font-semibold text-gray-800">
        SAFI (Model Name)
      </h1>
      <p className="mb-6 text-gray-600">
        Student Assistant for Facility Information
      </p>
      {/* Centered input box */}
      <div className="flex w-full justify-center px-6">
        <div className="flex w-full max-w-2xl items-center rounded-2xl bg-white px-4 py-3 text-gray-800">
          {/* Left icons */}
          <div className="flex items-center gap-3"></div>
          {/* Textarea */}
          <textarea
            rows={1}
            placeholder="Ask about RMIT facilities"
            onInput={handleInputChange}
            style={{ overflow: 'hidden' }}
            className="mx-4 flex-1 resize-none bg-transparent text-left text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          {/* Right icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                handleClick().catch((error) => {
                  console.error('Unhandled error in handleClick:', error);
                });
              }}
              className="bg-cyan-blue hover:bg-cyan-blue-hover rounded-full p-2 transition"
            >
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19V5m-7 7l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Newchat

import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import type { ChatMessage } from 'types/ChatTypes'
import { getChatMessages, saveChatHistory, isThreadInChats, getChatHistory } from 'services/chatService'
import ReactMarkdown from 'react-markdown'

interface SafiResponse {
  thread_id: string;
  response: string;
}

const Oldchat = () => {
  const navigate = useNavigate()
  const API: string = import.meta.env.VITE_EXPRESS_URL as string
  const [inputText, setInputText] = useState('')
  const { threadId } = useParams<{ threadId: string }>()
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (threadId && !isThreadInChats(threadId)) {
      console.log('Error fetching chat history: Thread ID not found in chats')
      void navigate('/')
    } else if (threadId) {
      setChatMessages(getChatMessages(threadId))
    } else {
      console.log('No thread ID provided, redirecting to home')
      void navigate('/')
    }
  }, [threadId, navigate])

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
    // Append user's message
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: inputText,
    }
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage])
    // Set loading state to display a waiting bubble
    setIsLoading(true)
  
    try {
      setInputText('')
      const result: AxiosResponse<SafiResponse> = await axios.post(`${API}/api/safi-request/${getChatHistory(threadId as string).meta_data.thread_id}`, {
        prompt: inputText,
      });
  
      const _threadId = result.data.thread_id
      const response = result.data.response
      
      // Append the actual assistant response and remove loading bubble
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
      }
      setChatMessages((prevMessages) => [...prevMessages, assistantMessage])
      
      // Save the chat history without the temporary "typing" bubble
      saveChatHistory(threadId as string, {
        messages: [...chatMessages, newUserMessage, assistantMessage],
        meta_data: {
          thread_id: _threadId,
          last_saved: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error('Error making request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex h-12/12 w-full max-w-2xl flex-col px-6">
        <div className=" flex-1 overflow-y-auto">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end text-right' : 'justify-start text-left'}`}
            >
              <div
                className={`max-w-xl rounded-2xl px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-cyan-blue text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                <p className="text-sm">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </p>
              </div>
            </div>
          ))}
          {/* Display the waiting bubble if the assistant is typing */}
          {isLoading && (
            <div className="flex justify-start text-left mb-4">
              <div className="max-w-xl rounded-2xl px-4 py-2 bg-white text-gray-600">
                <p className="text-sm italic">Assistant is typing...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full items-center align-bottom rounded-2xl bg-white px-4 py-3 text-gray-800">
        <textarea
          rows={1}
          placeholder="Ask about RMIT facilities"
          onInput={handleInputChange}
          value={inputText}
          style={{ overflow: 'hidden' }}
          className="mx-4 flex-1 resize-none bg-transparent text-left text-gray-800 placeholder-gray-400 focus:outline-none"
        />
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
    </main>
  )
}

export default Oldchat
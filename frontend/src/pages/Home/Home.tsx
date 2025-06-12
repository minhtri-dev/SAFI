import { Sidebar, Newchat, Oldchat } from './components'
import { Layout } from '@layouts'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { isThreadInChats } from 'services/chatService'

const Home = () => {
  const navigate = useNavigate()
  const { threadId } = useParams<{ threadId: string }>()

  useEffect(() => {
    console.log('Thread ID:', threadId)
    try {
      if (threadId && !isThreadInChats(threadId)) {
        console.log('Error fetching chat history: Thread ID not found in chats')
        navigate('/')
      }
    } catch (error) {
      console.error('Error fetching chat history:', error)
      navigate('/')
    }
  })

  return (
    <div className="flex h-screen flex-col">
      <Layout>
        <div className="flex flex-1 bg-gray-100">
          {/* Sidebar */}
          <Sidebar />
          {/* Chat area */}
          
          {threadId && isThreadInChats(threadId) ? <Oldchat /> : <Newchat />}
        </div>
      </Layout>
    </div>
  )
}

export default Home

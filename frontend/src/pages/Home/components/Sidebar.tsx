import { Icon } from '@iconify-icon/react'
import { useNavigate } from 'react-router'
import { getAllChats } from 'services/chatService'

import type { ChatHistory } from 'types/ChatTypes'

const Sidebar = () => {
  const chats: ChatHistory[] = getAllChats().sort(
    (a, b) =>
      new Date(b.meta_data.last_saved).getTime() -
      new Date(a.meta_data.last_saved).getTime(),
  )
  const navigate = useNavigate()

  const handleClick = () => {
    void navigate('/')
  }

  const truncateMessage = (message: string, maxLength: number): string => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + '…'
      : message
  }

  return (
    <aside className="hidden w-64 bg-white p-4 md:block">
      <button
        onClick={handleClick}
        className="bg-cyan-blue hover:bg-cyan-blue-hover mb-6 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-white"
      >
        <Icon icon="jam:write" size={20} />
        New chat
      </button>
      <div className="text-sm text-gray-600">
        <p className="mb-2">Recent</p>
        <ul className="space-y-2">
          {chats.map((chat) => (
            <li
              key={chat.meta_data.thread_id}
              className="cursor-pointer rounded p-2 hover:bg-gray-200"
              onClick={void navigate(`/${chat.meta_data.thread_id}`)}
            >
              {truncateMessage(
                chat.messages[0]?.content || 'No messages yet',
                34,
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar

import Chats from '@/app/components/sidebars/Chats'
import Topics from '@/app/components/sidebars/Topics'
import ChatWindow from './components/chat/ChatWindow'

export default function Home() {
  return (
    <div className="flex flex-row">
      {/* <Chats />  */}
      <Topics />
      <ChatWindow />
    </div>
  )
}

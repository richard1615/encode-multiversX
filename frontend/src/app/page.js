import Chats from '@/app/components/sidebars/Chats'
import Topics from '@/app/components/sidebars/Topics'
import ChatWindow from './components/chat/ChatWindow'

export default function Home() {

  supabase.auth.getSession()
  .then(({ data }) => {
    const session = data.session;
    if (!session) {
      // this is a protected route - only users who are signed in can view this route
      redirect('/');
    }
  })

  return (
    <div className="flex flex-row">
      {/* <Chats />  */}
      <Topics />
      <ChatWindow />
    </div>
  )
}

'use client'

import Chats from '@/app/components/sidebars/Chats'
import Topics from '@/app/components/sidebars/Topics'
import ChatWindow from './components/chat/ChatWindow'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Home() {
  const supabase = createClientComponentClient()
  const router = useRouter()


  supabase.auth.getSession()
  .then(({ data }) => {
    const session = data.session;
    console.log(session)
    if (session === null) {
      // this is a protected route - only users who are signed in can view this route
      router.push('/login')
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

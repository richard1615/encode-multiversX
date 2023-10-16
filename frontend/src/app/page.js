'use client'
import { useEffect, useState } from 'react'
import Topics from '@/app/components/sidebars/Topics'
import ChatWindow from './components/chat/ChatWindow'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useChatStore } from '@/store/store'

export default function Home() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const user = useChatStore((state) => state.user)
  const setUser = useChatStore((state) => state.setUser)


  useEffect(() => {
    async function fetchUser() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (!data.session) {
          router.push('/login')
        } else {
          const { data, error } = await supabase.auth.getUser()
          setUser(data.user)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchUser()
  }, [])
  
  return (
    <div className="flex flex-row">
      <Topics />
      <ChatWindow />
    </div>
  )
}

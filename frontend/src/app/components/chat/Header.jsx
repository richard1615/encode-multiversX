'use client'

import React from 'react'
import ChainInfo from '../ChainInfo'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

function Header() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex items-center justify-between px-4 py-7 border-b border-b-mindful-gray-40">
      <h1 className="text-4xl text-mindful-gray-80 font-bold">MxAI</h1>
      <div className='flex items center'>
        <ChainInfo connected={true} />
        <button onClick={handleSignOut} className='rounded-lg bg-mindful-gray-80 text-white text-semibold p-2 ml-4'>Logout</button>
      </div>
    </div>
  )
}

export default Header
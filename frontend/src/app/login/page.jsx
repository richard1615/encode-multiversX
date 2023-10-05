'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
    })
  }

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
    // router.refresh()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-4 space-y-4 bg-white rounded-md shadow-lg">
        <input
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Password"
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button 
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={handleSignUp}>
          Sign up
        </button>
        <button 
          className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-blue-600"
          onClick={handleSignIn}>
          Sign in
        </button>
        <button 
          className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  )
}

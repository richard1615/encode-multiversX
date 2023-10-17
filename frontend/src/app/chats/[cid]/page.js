'use client'
import { useParams } from 'next/navigation'
import Header from '../../components/chat/Header'
import MessageWindow from '../../components/chat/messages/MessageWindow'
import UserMessage from '../../components/chat/messages/UserMessage'
import BotMessage from '../../components/chat/messages/BotMessage'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const { cid } = useParams()
  const supabase = createClientComponentClient();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function getMessages() {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('text, is_bot')
          .eq('conversation_id', cid)
          .order('created_at', { ascending: false });
        if (data === null) {
          setMessages([]);
        } else {
          setMessages(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, []);

  return (
    <div className='flex flex-col w-full min-w-[300px] max-h-screen'>
      <div className="flex items-center justify-between px-4 py-7 border-b border-b-mindful-gray-40">
        <h1 className="text-4xl text-mindful-gray-80 font-bold">MxAI</h1>
        <h1 className="text-4xl text-mindful-gray-80 font-bold">Chat #{cid}</h1>
      </div>
      <div className='flex flex-col-reverse flex-grow p-10 overflow-y-scroll'>
        {
          (!messages || messages.length === 0) ? (
            <div className="text-center text-gray-500 italic flex flex-col items-center gap-6 justify-center h-screen">
              <Image src="/icons/empty-box.svg" alt="Empty icon" width={350} height={350} />
              <p>👋 Hey there! Looks like this conversation is empty!</p>
            </div>
          ) : (
            messages?.map((message, index) => {
              if (message.is_bot) {
                return <BotMessage key={index} message={message.text} />
              } else {
                return <UserMessage key={index} message={message.text} />
              }
            })
          )
        }
      </div>
    </div>
  )
}
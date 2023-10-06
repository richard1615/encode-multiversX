import React from 'react'
import UserMessage from './UserMessage'
import BotMessage from './BotMessage'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';

const MessageWindow = ({ selectedChatId }) => {
  const supabase = createClientComponentClient();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function getMessages() {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('text, is_bot')
          .eq('conversation_id', selectedChatId)
          .order('created_at', { ascending: true });
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [selectedChatId]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime posts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, payload => {
        setMessages(messages => [...messages, payload.new]);
      }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [supabase]);

  return (
    <div className='flex flex-col flex-grow p-10 overflow-y-scroll'>
      {
        messages === null ? (
          <div className="text-center text-gray-500 italic">
            👋 Hey there! How can I assist you today? Just start typing or ask any question to begin our chat.
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
  )
}

export default MessageWindow

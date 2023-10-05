import React from 'react'
import Header from './Header'
import Input from './Input'
import MessageWindow from './messages/MessageWindow'

function ChatWindow({ selectedChatId }) {
  return (
    <div className='flex flex-col w-full min-w-[300px] max-h-screen'>
      <Header />
      <MessageWindow selectedChatId={selectedChatId} />
      <Input selectedChatId={selectedChatId} />
    </div>
  )
}

export default ChatWindow

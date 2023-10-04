import React from 'react'
import Header from './Header'
import Input from './Input'
import MessageWindow from './messages/MessageWindow'

function ChatWindow() {
  return (
    <div className='flex flex-col w-[60%] min-w-[300px] max-h-screen'>
      <Header />
      <MessageWindow />
      <Input />
    </div>
  )
}

export default ChatWindow

import React from 'react'
import UserMessage from './UserMessage'
import BotMessage from './BotMessage'

const messages = [
  {
    content: 'Hi, I am Mindful Bot. How can I help you?',
    isBot: true
  },
  {
    content: 'I am feeling stressed',
    isBot: false
  },
  {
    content: 'Sorry to hear that. Would you like some tips to manage stress?',
    isBot: true
  },
  {
    content: 'Yes, that would be helpful.',
    isBot: false
  },
  {
    content: "Stress is a common issue that many people face in their daily lives. It can be caused by various factors such as work, relationships, and personal responsibilities. It's important to recognize when you're feeling stressed and take steps to manage it. One effective way to manage stress is through relaxation techniques such as deep breathing, meditation, and mindfulness exercises. These practices can help calm your mind and reduce the physical and emotional symptoms of stress.",
    isBot: true
  },
  {
    content: "Additionally, it's essential to take breaks, prioritize self-care, and seek support from friends, family, or professionals when needed. Remember that managing stress is an ongoing process, and it's okay to ask for help when you need it.",
    isBot: true
  }
]


const MessageWindow = () => {
  return (
    <div className='flex flex-col flex-grow p-10 overflow-y-scroll'>
      { messages.map((message, index) => {
        if (message.isBot) {
          return <BotMessage key={index} message={message.content} />
        } else {
          return <UserMessage key={index} message={message.content} />
        }
      }) }
    </div>
  )
}

export default MessageWindow

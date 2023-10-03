import React from 'react'

import Image from 'next/image';

const ChatTopics = [
  {
    name: "Mental Healthhhhh",
    icon: "/icons/avatar-0.svg"
  },
  {
    name: "I don't wanna live forever",
    icon: "/icons/avatar-1.svg"
  },
  {
    name: "I just wanna keep calling your name",
    icon: "/icons/avatar-2.svg"
  }
]

function Topics() {
  return (
    <div className="w-[20%] min-w-[100px] bg-[#F7F4F2] h-screen flex flex-col">
      <div className="flex flex-row items-center px-4 py-10 gap-4">
        <Image src="/icons/chat-double.svg" alt="Chat Double icon" width={32} height={32} />
        <p className="text-[#4B3425] text-3xl font-bold">Topics</p>
      </div>
      {ChatTopics.map(({ name, icon }, index) => (
        <div className="flex flex-row items-center gap-4 p-4 w-full" key={index}>
          <Image src={icon} alt="Plus icon" width={64} height={64} />
          <div className="flex flex-col gap-1.5 w-full">
            <button className="text-[#3D4A26] text-lg w-[85%] font-bold overflow-hidden whitespace-nowrap text-ellipsis text-left">{name}</button>
            <div className="flex flex-row gap-2">
              <button className="flex flex-row gap-1 items-center">
                <Image src="/icons/share.svg" alt="Share icon" width={20} height={20} />
                <div className="text-[#1F160F7A] text-sm font-semibold">Share</div>
              </button>
              <button className="flex flex-row gap-1 items-center">
                <Image src="/icons/layer-add.svg" alt="Add icon" width={20} height={20} />
                <div className="text-[#1F160F7A] text-sm font-semibold">Add</div>
              </button>
              <button className="flex flex-row gap-1 items-center">
                <Image src="/icons/delete.svg" alt="Delete icon" width={20} height={20} />
                <div className="text-[#1F160F7A] text-sm font-semibold">Delete</div>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Topics

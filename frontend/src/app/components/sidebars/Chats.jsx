"use client"

import React, { useState } from 'react';
import Image from 'next/image';

function Chats() {
  const [selectedItem, setSelectedItem] = useState(null);

  const items = [
    {
      name: "Current",
      count: 12,
      icon: "/icons/dashboard.svg"
    },
    {
      name: "Bookmarked",
      count: 13,
      icon: "/icons/mobile.svg"
    },
    {
      name: "Favourite",
      count: 14,
      icon: "/icons/star.svg"
    },
    {
      name: "Trash",
      count: 12,
      icon: "/icons/trash.svg"
    },
    {
      name: "Unassigned",
      count: 78,
      icon: "/icons/question.svg"
    }
  ];

  return (
    <div className="w-[20%] min-w-[100px] bg-light-cream text-white h-screen flex flex-col">
      <div className="flex items-center justify-between px-4 py-8">
        <h1 className="text-3xl text-mindful-gray-80 font-semibold">Chats</h1>
        <Image src="/icons/search.svg" alt="Plus icon" width={24} height={24} className='cursor-pointer w-8 h-8' />
      </div>
      <div className='text-xs text-slate-800 flex justify-center mt-6 mb-3'>
        <span>All Conversations</span>
        <span>&nbsp;·&nbsp;</span>
        <span>345 Total</span>
      </div>
      <ul>
        {items.map(({ name, count, icon }, index) => (
          <li
            key={index}
            onClick={() => setSelectedItem(name)}
            className={`flex px-4 py-8 text-mindful-gray-80 font-semibold border-b border-b-mindful-gray-40 cursor-pointer justify-between ${selectedItem === name ? 'bg-empathy-orange-10 border-r-4 border-r-empathy-orange-40' : 'hover:bg-empathy-orange-10'}`}
          >
            <div className="flex items-center">
              <Image src={icon} alt={`${name} icon`} width={24} height={24} className="inline-block mr-3" />
              {name}
            </div>
            <div className={`${selectedItem === name ? 'text-empathy-orange-40' : 'text-mindful-gray-40'}`}>
              {count}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-auto mb-4 ml-3 flex items-center space-x-3">
        <Image src="" alt="User Name" width={48} height={48} className="rounded-full border-2 border-gray-600" />
        <span className='text-mindful-gray-80 font-semibold'>User Name</span>
      </div>
    </div>
  );
}

export default Chats;

"use client"

import React, { useState } from 'react';
import Image from 'next/image';

const ChatTopics = [
  {
    id: 1,
    name: "Mental Healthhh",
    icon: "/icons/avatar-0.svg"
  },
  {
    id: 2,
    name: "I don't wanna live forever",
    icon: "/icons/avatar-1.svg"
  },
  {
    id: 3,
    name: "I just wanna keep calling your name",
    icon: "/icons/avatar-2.svg"
  }
];

const topicItemClass = (isSelected) =>
  `flex flex-row items-center gap-2 p-4 w-full ${isSelected ? "bg-[#E5EAD7] border-r-4 border-solid border-[#9BB068]" : ""}`;
const buttonClass = (isSelected) =>
  `flex flex-row gap-1 items-center ${isSelected ? "hover:bg-[#c6d6af]" : "hover:bg-[#E5EAD7]"} rounded-3xl py-1 px-2`;
const buttonTextClass = (isSelected) => `${isSelected ? "text-[#3D4A26]" : "text-[#1F160F7A]"} text-sm font-semibold`;

function TopicItem({ id, name, icon, selectedItem, setSelectedItem }) {
  const isSelected = id === selectedItem;

  const handleShareClick = () => {
    console.log("Share button clicked");
  };

  const handleAddClick = () => {
    console.log("Add button clicked");
  };

  const handleDeleteClick = () => {
    console.log("Delete button clicked");
  };

  return (
    <div className={topicItemClass(isSelected)}>
      <Image src={icon} alt="Plus icon" width={64} height={64} />
      <div className="flex flex-col gap-0.5" style={{ width: "calc(100% - 80px)" }}>
        <button className={`text-[#3D4A26] text-lg font-bold overflow-hidden whitespace-nowrap text-ellipsis text-left pl-2`} onClick={() => setSelectedItem(id)}>{name}</button>
        <div className="flex flex-row items-center">
          <button className={buttonClass(isSelected)} onClick={handleShareClick}>
            <Image src={isSelected ? "/icons/share-selected.svg" : "/icons/share.svg"} alt="Share icon" width={20} height={20} />
            <div className={buttonTextClass(isSelected)}>Share</div>
          </button>
          <button className={buttonClass(isSelected)} onClick={handleAddClick}>
            <Image src={isSelected ? "/icons/layer-add-selected.svg" : "/icons/layer-add.svg"} alt="Add icon" width={20} height={20} />
            <div className={buttonTextClass(isSelected)}>Add</div>
          </button>
          <button className={buttonClass(isSelected)} onClick={handleDeleteClick}>
            <Image src={isSelected ? "/icons/delete-selected.svg" : "/icons/delete.svg"} alt="Delete icon" width={20} height={20} />
            <div className={buttonTextClass(isSelected)}>Delete</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function Topics() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="w-[30%] min-w-[150px] bg-[#F7F4F2] flex flex-col h-screen justify-between">
      <div className="h-[90%]">
        <div className="flex flex-row items-center px-4 py-8 gap-4">
          <Image src="/icons/chat-double.svg" alt="Chat Double icon" width={32} height={32} />
          <p className="text-[#4B3425] text-3xl font-bold">Topics</p>
        </div>
        <div className="h-[90%] overflow-y-auto">
          {ChatTopics.map(({ id, name, icon }, index) => (
            <TopicItem
              key={index}
              id={id}
              name={name}
              icon={icon}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          ))}
        </div>
      </div>
      <button className="bg-[#9BB068] m-6 py-2 px-6 rounded-3xl flex flex-row gap-2 justify-center items-center hover:bg-[#97a754]">  
        <Image src="/icons/add.svg" alt="Plus icon" width={32} height={32} />
        <p className="text-white text font-semibold">Add a New Conversation</p>
      </button>
    </div>
  );
}

export default Topics;

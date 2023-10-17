"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useChatStore } from '@/store/store';
import Snackbar from '@mui/material/Snackbar';


const ChatAvatars = [
  "/icons/avatar-0.svg",
  "/icons/avatar-1.svg",
  "/icons/avatar-2.svg",
  "/icons/avatar-3.svg",
  "/icons/avatar-4.svg",
];

const topicItemClass = (isSelected, isDeleting) =>
  `flex flex-row items-center gap-2 p-4 w-full ${isSelected && "bg-[#E5EAD7] border-r-4 border-solid border-[#9BB068]"} ${isDeleting && "opacity-50"}`;
const buttonClass = (isSelected) =>
  `flex flex-row gap-1 items-center ${isSelected ? "hover:bg-[#c6d6af]" : "hover:bg-[#E5EAD7]"} rounded-3xl py-1 px-2`;
const buttonTextClass = (isSelected) => `${isSelected ? "text-[#3D4A26]" : "text-[#1F160F7A]"} text-sm font-semibold`;

function TopicItem({ id, name, avatar, selectedChatId, setSelectedChatId, conversations, setConversations }) {
  const isSelected = id === selectedChatId;
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClientComponentClient();
  const [open, setOpen] = useState(false);

  const handleShareClick = () => {
    console.log("Share button clicked");
    navigator.clipboard.writeText(`${window.location.origin}/chats/${id}`);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleDeleteClick = async () => {
    try {
      setIsDeleting(true);
      await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

        if (isSelected) {
          setSelectedChatId(null);
        }

        setConversations(conversations.filter((conversation) => conversation.id !== id));
        setIsDeleting(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={topicItemClass(isSelected, isDeleting)}>
      <Image src={avatar} alt="Plus icon" width={64} height={64} />
      <div className="flex flex-col gap-0.5" style={{ width: "calc(100% - 80px)" }}>
        <button className={`text-[#3D4A26] text-lg font-bold overflow-hidden whitespace-nowrap text-ellipsis text-left pl-2`} onClick={() => setSelectedChatId(id)}>{name}</button>
        <div className="flex flex-row items-center">
          <button className={buttonClass(isSelected)} onClick={handleShareClick}>
            <Image src={isSelected ? "/icons/share-selected.svg" : "/icons/share.svg"} alt="Share icon" width={20} height={20} />
            <div className={buttonTextClass(isSelected)}>Share</div>
          </button>
          <button className={buttonClass(isSelected)} onClick={handleDeleteClick}>
            <Image src={isSelected ? "/icons/delete-selected.svg" : "/icons/delete.svg"} alt="Delete icon" width={20} height={20} />
            <div className={buttonTextClass(isSelected)}>Delete</div>
          </button>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        message="Link copied to clipboard"
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'centre' }}
      />
    </div>
  );
}

function Topics() {
  const user = useChatStore((state) => state.user);
  const conversations = useChatStore((state) => state.conversations);
  const setConversations = useChatStore((state) => state.setConversations);
  const selectedChatId = useChatStore((state) => state.selectedChatId);
  const setSelectedChatId = useChatStore((state) => state.setSelectedChatId);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchConversations() {
      try {
        if (user) {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

          const conversationsTemp = data.map((conversation) => ({
            ...conversation,
            avatar: ChatAvatars[Math.floor(Math.random() * ChatAvatars.length)],
          }));
          setConversations(conversationsTemp);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchConversations();
  }, [user]);

  const handleAddNewConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([
          { name: `New Conversation ${conversations.length + 1}`, user_id: user.id },
        ])
        .select();

      const newConversation = {
        ...data[0],
        avatar: ChatAvatars[Math.floor(Math.random() * ChatAvatars.length)],
      };

      setConversations([newConversation, ...conversations]);
      setSelectedChatId(newConversation.id);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-[25%] min-w-[125px] bg-[#F7F4F2] flex flex-col h-screen justify-between">
      <div className="h-[90%]">
        <div className="flex flex-row items-center px-4 py-8 gap-4">
          <Image src="/icons/chat-double.svg" alt="Chat Double icon" width={32} height={32} />
          <p className="text-[#4B3425] text-3xl font-bold">Chats</p>
        </div>
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-[90%]">
            <CircularProgress sx={{ color: "#9BB068" }} />
          </div>
        )}
        {!isLoading && <div className="h-[90%] overflow-y-auto">
          {conversations?.map(({ id, avatar, name }, index) => (
            <TopicItem
              key={index}
              id={id}
              name={name}
              avatar={avatar}
              selectedChatId={selectedChatId}
              setSelectedChatId={setSelectedChatId}
              conversations={conversations}
              setConversations={setConversations}
            />
          ))}
        </div>}
      </div>
      <button className="bg-[#9BB068] m-6 py-2 px-6 rounded-3xl flex flex-row gap-2 justify-center items-center hover:bg-[#97a754]"
        onClick={handleAddNewConversation}>
        <Image src="/icons/add.svg" alt="Plus icon" width={32} height={32} />
        <p className="text-white text font-semibold">Add a New Conversation</p>
      </button>
    </div>
  );
}

export default Topics;

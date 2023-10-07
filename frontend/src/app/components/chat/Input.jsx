'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useChatStore } from '@/store/store';

const ChatAvatars = [
	"/icons/avatar-0.svg",
	"/icons/avatar-1.svg",
	"/icons/avatar-2.svg"
];

function Input() {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	const [inputValue, setInputValue] = useState('');
	const supabase = createClientComponentClient();
	const selectedChatId = useChatStore((state) => state.selectedChatId);
	const user = useChatStore((state) => state.user);
	const conversations = useChatStore((state) => state.conversations);
	const setConversations = useChatStore((state) => state.setConversations);
	const setSelectedChatId = useChatStore((state) => state.setSelectedChatId);


	const handleInputChange = (event) => {
		const target = event.target;
		setInputValue(target.value);
		target.style.height = 'auto';
		target.style.height = (target.scrollHeight) + 'px';
	};

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
			return newConversation.id;
		} catch (error) {
			console.log(error);
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		let chatIdToSend;
		if (!selectedChatId) {
			try {
				chatIdToSend = await handleAddNewConversation();
			} catch (err) {
				console.error("Error creating new conversation:", err.message);
				return; // Exit early if we couldn't create a new chat
			}
		} else {
			chatIdToSend = selectedChatId;
		}
		try {
			// Send to DB
			const { data, error } = await supabase.from('messages').insert([
				{ text: inputValue, conversation_id: chatIdToSend, is_bot: false },
			]);

			if (error) {
				throw error;
			}
			console.log('data:', data);

			// Send to ML server
			const mlResponse = await fetch(`${baseUrl}/generate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text: inputValue,
					user_id: user.id,
					chat_id: selectedChatId,
					openAIKey: localStorage.getItem('openAIKey'),
				}),
			});

			// Check if the ML server responded with a non-200 status code
			if (!mlResponse.ok) {
				throw new Error(`ML server responded with status ${mlResponse.status}`);
			}

			const mlData = await mlResponse.json();
			console.log('mlData:', mlData);
		} catch (err) {
			console.error("Error in handleSubmit:", err.message);
		} finally {
			// Reset input value regardless of success or error
			setInputValue('');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex align-items-center m-6 rounded-custom bg-mindful-gray-10 relative">
				<textarea
					value={inputValue}
					onChange={handleInputChange}
					placeholder="Send your message to Dr.Freud...."
					className={`flex-grow m-10 outline-none border-none rounded-custom min-h-28 bg-mindful-gray-10 text-lg font-semibold text-slate-600 placeholder-slate-600 resize-none overflow-y-scroll max-h-60`}
					rows={1}
					onKeyDown={(event) => {
						if (event.key === 'Enter' && !event.shiftKey) {
							handleSubmit(event);
						}
					}}
				/>
				<button
					type="submit"
					className={`flex absolute bottom-0 right-4 justify-center items-center bg-leaf-green text-white rounded-full focus:outline-none w-16 h-16 m-6`}
				>
					<Image src='/icons/send.svg' alt='Send' width={35} height={35} />
				</button>
			</div>
		</form>
	)
}

export default Input;

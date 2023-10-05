'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function Input() {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        const target = event.target;
        setInputValue(target.value);
        target.style.height = 'auto';
        target.style.height = (target.scrollHeight) + 'px';
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputValue);
        setInputValue('');

        const supabase = createClientComponentClient();
        supabase.from('chats').insert([
            { text: inputValue },
        ]).then((res) => {
            console.log(res)
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex align-items-center m-6 rounded-custom bg-mindful-gray-10 relative">
                <textarea
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Send your message to Dr.Freud...."
                    className="flex-grow m-10 outline-none border-none rounded-custom min-h-28 bg-mindful-gray-10 text-lg font-semibold text-slate-600 placeholder-slate-600 resize-none overflow-y-scroll max-h-60"
                    rows={1}
                />
                <button type="submit" className="flex absolute bottom-1 right-6 justify-center items-center bg-leaf-green text-white rounded-full focus:outline-none w-16 h-16 m-6 hover:bg-[#97a754]">
                    <Image src='/icons/send.svg' alt='Send' width={35} height={35} />
                </button>
            </div>
        </form>
    )
}

export default Input;

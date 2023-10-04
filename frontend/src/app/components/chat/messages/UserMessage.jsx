import React from 'react'
import Image from 'next/image'

const UserMessage = ({ message }) => {
    return (
        <div className='flex justify-end w-full relative mb-5'>
            <div className='flex bg-mindful-gray-80 rounded-2xl p-3 max-w-lg'>
                <div className='flex flex-col text-white flex-grow overflow-hidden'>
                    { message }
                </div>
                <div className='flex-shrink-0 m-2 rounded-full overflow-hidden w-[50px]'>
                    <Image src="/icons/avatar-0.svg" alt="User Profile" width={50} height={50} />
                </div>
            </div>
            <span className='w-10 h-10 rounded-bl-full bg-mindful-gray-80 absolute bottom-0 right-0 transform translate-y-1/2'></span>
        </div>
    )
}

export default UserMessage

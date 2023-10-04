import React from 'react'
import Image from 'next/image'

const BotMessage = ({ message }) => {
    return (
        <div className='flex justify-start w-full relative mb-5'>
            <div className='flex bg-light-cream rounded-2xl p-3 max-w-lg'>
                <div className='flex flex-shrink-0 m-2 rounded-full overflow-hidden'>
                    <Image src="/icons/avatar-1.svg" alt="User Profile" width={50} height={50} />
                </div>
                <div className='flex flex-col text-gray-700 ml-1 flex-grow overflow-hidden'>
                    { message }
                </div>
            </div>
            <span className='w-10 h-10 rounded-br-full bg-light-cream absolute bottom-0 left-0 transform translate-y-1/2'></span>
        </div>
    )
}

export default BotMessage

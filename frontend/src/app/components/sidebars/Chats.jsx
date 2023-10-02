import React from 'react'

import Image from 'next/image'

function Chats() {
    return (
        <div className="w-[20%] min-w-[100px] bg-gray-800 text-white h-screen flex flex-col p-4">
            <h1 className="text-xl mb-6">Chats</h1>
            <ul>
                <li className="mb-2 hover:bg-gray-700 px-2 py-1 rounded">
                    Current
                </li>
                <li className="mb-2 hover:bg-gray-700 px-2 py-1 rounded">
                    Bookmarked
                </li>
                <li className="mb-2 hover:bg-gray-700 px-2 py-1 rounded">
                    Favourites
                </li>
                <li className="mb-2 hover:bg-gray-700 px-2 py-1 rounded">
                    Trash
                </li>
                <li className="mb-2 hover:bg-gray-700 px-2 py-1 rounded">
                    Unassigned
                </li>
            </ul>
            <div className="mt-auto mb-2 flex items-center space-x-3">
                <Image src="" alt="User Name" width={48} height={48} className="rounded-full border-2 border-gray-600" />
                <span>User Name</span>
            </div>
        </div>
    )
}

export default Chats

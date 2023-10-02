import React from 'react'

const ChatTopics = ["Mental Health", "Stress Anxiety", "Status Anxiety"]

function Topics() {
    return (
        <div className="w-[20%] min-w-[100px] bg-gray-800 text-white h-screen flex flex-col p-4">
            <h1 className="text-xl mb-6">Chats</h1>
            <ul className='list-none'>
                {
                    ChatTopics.map((topic, index) => (
                        <li className="mb-2 hover:bg-gray-700 px-2 py-1 rounded" key={index}>
                            {topic}
                        </li>
                    ))
                }
            </ul>
            <div className="mt-auto mb-2 flex items-center space-x-3">
                <button>Add a new conversation</button>
            </div>
        </div>
    );
}

export default Topics

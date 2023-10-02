import React from 'react'

function Input() {
    return (
        <div className="flex border rounded-md">
            <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow p-2 outline-none rounded-l-md"
            />
            <button
                className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
            >
                Send
            </button>
        </div>
    )
}

export default Input

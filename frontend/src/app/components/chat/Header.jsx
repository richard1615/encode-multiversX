import React from 'react'
import ChainInfo from '../ChainInfo'

function Header() {
    return (
        <div className="flex items-center justify-between px-4 py-10 border-b border-b-mindful-gray-40">
            <h1 className="text-4xl text-mindful-gray-80 font-bold">Doctor Freud.ai</h1>
            <ChainInfo connected={true} />
        </div>
    )
}

export default Header

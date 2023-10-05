import React from 'react'

const ChainInfo = ({ connected }) => {
  return (
    <div className='flex items-center rounded-lg border-2 border-mindful-gray-80 p-2'>
      {
        connected ? (
          <>
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Connected - devnet</span>
          </>
        ) : (
          <>
            <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
            <span>Not Connected</span>
          </>
        )
      }
    </div>
  )
}

export default ChainInfo;

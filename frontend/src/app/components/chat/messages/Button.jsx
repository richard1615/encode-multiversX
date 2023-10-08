'use client'

import React from 'react'

const Button = ({ onClick }) => {
  return (
    <button onClick={onClick} className='bg-white text-mindful-gray-80 font-semibold m-2 py-2 px-6 rounded-md shadow-md transform transition'>
      Create Transaction
    </button>
  )
}

export default Button

'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import React, { useEffect, useState } from 'react'
import Popover from '@mui/material/Popover';
import { useRouter } from 'next/navigation'
import Image from 'next/image';


export default function BasicPopover() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState(null);
  const [editingAPIKey, setEditingAPIKey] = useState(false);
  const [editingWallet, setEditingWallet] = useState(false);
  const [openAPIKey, setOpenAPIKey] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [tempAPIKey, setTempAPIKey] = useState(openAPIKey);
  const [tempWalletAddress, setTempWalletAddress] = useState(walletAddress);

  useEffect(() => {
    setOpenAPIKey(window?.localStorage?.getItem('openAIKey') || '');
    setWalletAddress(window?.localStorage?.getItem('walletAddress') || '');
  }, []);

  useEffect(() => {
    if (anchorEl === null) {
      setEditingAPIKey(false);
      setEditingWallet(false);
      setTempAPIKey(openAPIKey);
      setTempWalletAddress(walletAddress);
    }
  }, [anchorEl])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const startEditingAPIKey = () => {
    setTempAPIKey(openAPIKey);
    setEditingAPIKey(true);
  };

  const saveAPIKey = () => {
    setOpenAPIKey(tempAPIKey);
    window?.localStorage?.setItem('openAIKey', tempAPIKey);
    setEditingAPIKey(false);
  };

  const startEditingWallet = () => {
    setTempWalletAddress(walletAddress);
    setEditingWallet(true);
  };

  const saveWalletAddress = () => {
    setWalletAddress(tempWalletAddress);
    window?.localStorage?.setItem('walletAddress', tempWalletAddress);
    setEditingWallet(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className='ml-4'>
      <Image src='/icons/avatar-0.svg' alt='User' onClick={handleClick} width={40} height={40} className='rounded-full cursor-pointer' />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className="p-4">

          <div className="flex mb-4">
            <label className="block mb-2">OpenAI API Key</label>
            <input
              type="text"
              value={editingAPIKey ? tempAPIKey : openAPIKey}
              onChange={e => setTempAPIKey(e.target.value)}
              className={`border px-2 py-1 w-full ${!editingAPIKey ? 'bg-gray-200 cursor-not-allowed' : ''}`}
              disabled={!editingAPIKey}
            />
            <button
              onClick={editingAPIKey ? saveAPIKey : startEditingAPIKey}
              className="text-white px-4 py-2 rounded-r bg-mindful-gray-80"
            >
              {editingAPIKey ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="flex mb-4">
            <label className="block mb-2">Wallet Address</label>
            <input
              type="text"
              value={editingWallet ? tempWalletAddress : walletAddress}
              onChange={e => setTempWalletAddress(e.target.value)}
              className={`border px-2 py-1 w-full ${!editingWallet ? 'bg-gray-200 cursor-not-allowed' : ''}`}
              disabled={!editingWallet}
            />
            <button
              onClick={editingWallet ? saveWalletAddress : startEditingWallet}
              className="text-white px-4 py-2 rounded-r bg-mindful-gray-80"
            >
              {editingWallet ? 'Save' : 'Edit'}
            </button>
          </div>

          <button onClick={handleSignOut} className='rounded-lg w-full bg-mindful-gray-80 text-white text-bold p-2'>Logout</button>
        
        </div>
      </Popover>
    </div>
  );
}

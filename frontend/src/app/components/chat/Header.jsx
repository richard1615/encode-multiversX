import React from 'react';
import UserModal from '../modals/UserModal';

function Header() {
  return (
    <div className="flex items-center justify-between px-4 py-7 border-b border-b-mindful-gray-40">
      <h1 className="text-4xl text-mindful-gray-80 font-bold">MxAI</h1>
      <div className="flex items-center">
        <UserModal />
      </div>
    </div>
  );
}

export default Header;

'use client';

import React from 'react';

export const Header = () => {
  return (
    <header className="bg-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Left side (optional, if you want to add something like 'LoginPage') */}
        <div></div>
        {/* Center text */}
        <h1 className="text-lg font-semibold text-gray-800">유니버스</h1>
        {/* Right side placeholder for balance */}
        <div></div>
      </div>
    </header>
  );
};

export default Header;
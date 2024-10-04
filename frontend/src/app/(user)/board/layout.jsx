'use client';
import React from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';

const BoardLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div>
        <LeftSidebar />
        {children}
        <RightSidebar />
      </div>
    </div>
  );
};

export default BoardLayout;
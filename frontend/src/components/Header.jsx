'use client';

import React from 'react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SearchBar from './SearchBar';

export const Header = () => {
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  const handleClickLogo = () => {
    router.push('/boards/related');
  };

  const handleLogout = async () => {
    try {
      await signOut(); // 로그아웃 처리
      router.push('/auth/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header className="h-15 bg-white py-2 shadow-md">
      <div className="w-full mx-auto flex items-center">
        {/* 로고 */}
        <div
          onClick={handleClickLogo}
          className="flex items-center space-x-1 cursor-pointer w-80 flex-shrink-0 px-4"
        >
          <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-tight">
            유니서클
          </span>
        </div>

        {/* 검색창 */}
        <div className="px-4 flex-grow">
          <SearchBar />
        </div>

        {/* 로그아웃 버튼 */}
        <div className="w-80 flex-shrink-0 flex justify-end px-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="focus:outline-none flex items-center"
              aria-label="로그아웃"
            >
              <Image src="/logout.png" alt="Logout" width={24} height={24} />
            </button>
          ) : (
            <div style={{ width: '24px', height: '24px' }}></div>
          )}
        </div>
      </div>
    </header>

  );
};

export default Header;

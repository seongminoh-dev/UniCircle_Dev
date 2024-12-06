'use client';

import React from 'react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const Header = () => {
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(); // 로그아웃 처리
      router.push('/auth/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-white via-gray-50 to-gray-100 py-4 shadow-md">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            유니서클
          </span>
        </div>
        <div className="ml-auto">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="ml-4 focus:outline-none flex items-center"
            aria-label="로그아웃"
          >
            <Image src="/logout.png" alt="Logout" width={24} height={24} />
          </button>
        ) : (
          // 로그아웃 버튼이 사라져도 공간 유지
          <div style={{ width: '24px', height: '24px' }}></div>
        )}
      </div>
      </div>
    </div>
  </header>
  );
};

export default Header;



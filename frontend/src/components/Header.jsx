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
    <header className="bg-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* 유니서클 타이틀 */}
        <h1 className="text-lg font-semibold text-gray-800 tracking-tighter absolute left-1/2 transform -translate-x-1/2">
          유니서클
        </h1>

        {/* 로그아웃 버튼 */}
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
    </header>
  );
};

export default Header;



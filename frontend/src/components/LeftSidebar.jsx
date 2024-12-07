'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks';
import { getEncounteredCircle } from '@/services';

export const LeftSidebar = () => {
  // 버튼 리스트
  const items = [
    { label: '나와 관련된 게시물', path: '/boards/related' },
    { label: '동아리 관리', path: '/circle-management' },
    { label: '설정', path: '/no-link' },
  ];
  const { user } = useAuth();
  const nickname = user?.nickname || '익명';
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 읽기
  const userEmail = user.email;

  // 선택된 메뉴 항목 상태
  const [selectedItem, setSelectedItem] = useState(pathname);
  const [joinedClubsCount, setJoinedClubsCount] = useState(0); // 가입 동아리 수 상태

  // 최초 렌더링
  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = (await getEncounteredCircle(userEmail)).length;
        setJoinedClubsCount(count); // 상태 업데이트
      } catch (error) {
        console.error('Failed to fetch joined clubs count:', error);
      }
    };
    fetchData();
  }, []);

  // 라우트가 변경될 때 선택 상태 업데이트
  useEffect(() => {
    setSelectedItem(pathname);
  }, [pathname]);

  const handleNavigation = (path) => {
    router.push(path); // 페이지 이동
    setSelectedItem(path); // 선택 상태 업데이트
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    // '동아리 관리' 버튼이 눌리면 특정 경로로 이동
    if (item === '동아리 관리') {
      router.push('/circle-management/'); // 원하는 경로로 라우팅
    }
  };

  return (
    <aside className="w-80 h-screen py-8 pl-6">
      {/* 닉네임 및 활동 정보 */}
      <div className="mb-2 space-y-4">
        <h3 className="text-3xl font-semibold">{nickname}</h3>
        <hr className="border-t-2 border-gray-300 my-2" /> {/* 가로선 추가 */}
        <p className="text-base text-gray-600 font-semibold">내 활동</p>
      </div>

      {/* 가입 정보 */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          가입 동아리 <span className="text-blue-500">{joinedClubsCount}</span>
        </p>
      </div>

      {/* 관련된 게시물 목록 (탐색 메뉴로 사용) */}
      <nav className="bg-white space-y-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`block w-full text-center py-2 px-4 rounded-lg shadow cursor-pointer ${
              selectedItem === item.path ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default LeftSidebar;

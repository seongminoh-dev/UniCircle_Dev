'use client';
import React, { useState } from 'react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation'; // Next.js의 useRouter 사용

export const LeftSidebar = () => {
  const items = ['나와 관련된 게시물', '관심 동아리', '동아리 관리', '설정'];
  const { user } = useAuth();
  const nickname = user?.nickname || '익명';
  const [selectedItem, setSelectedItem] = useState(items[0]);

  const router = useRouter(); // useRouter 훅 초기화

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
        <p className="text-base text-gray-600 font-semibold ">내 활동</p>
      </div>

      {/* 가입 정보 */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          가입 동아리 <span className="text-blue-500">3</span> | 작성 글 <span className="text-blue-500">12</span>
        </p>
      </div>

      {/* 관련된 게시물 목록 (탐색 메뉴로 사용) */}
      <nav className="bg-white space-y-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(item)} // 클릭 이벤트 핸들러
            className={`block w-full text-center py-2 px-4 rounded-lg shadow cursor-pointer
              ${selectedItem === item ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default LeftSidebar;

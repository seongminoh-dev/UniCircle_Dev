'use client';
import React from 'react';
import { useState } from 'react';

export const LeftSidebar = () => {
  // 항목 리스트를 배열로 저장
  const items = ['나와 관련된 게시물','관심 동아리', '동아리 관리', '설정'];
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <aside className="w-80 h-screen py-8 pl-6">
      {/* 닉네임 및 활동 정보 */}
      <div className="mb-2 space-y-4">
        <h3 className="text-3xl font-semibold">닉네임</h3>
        <hr className="border-t-2 border-gray-300 my-2" />   {/* 가로선 추가 */}
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
        {/* map으로 반복하여 각각의 버튼 생성 */}
        {items.map((item, index) => (
          <button
            key={index}
            // 클릭 시 선택된 아이템 상태 업데이트
            onClick={() => setSelectedItem(item)}
            // 선택된 상태일 때와 아닐 때의 스타일 구분
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
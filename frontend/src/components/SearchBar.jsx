"use client";
import React from 'react';

export const SearchBar = () => {
    return (
      <div className="flex items-center bg-neutral-100 mx-4 p-2 rounded-xl">
        {/* 뒤로 가기 아이콘 (옵션) */}
        <button className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-500"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
  
        {/* 검색 입력 필드 */}
        <input
          type="text"
          placeholder="Search"
          className="flex-grow bg-neutral-100 border-none outline-none px-4 py-1 text-gray-700 text-lg"
        />
  
        {/* 검색 버튼 */}
        <button className="bg-white text-black font-semibold px-4 py-2 rounded-2xl
         hover:bg-blue-500 hover:text-white">
          검색
        </button>
      </div>
    );
  };

export default SearchBar;


"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 관리
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex items-center bg-neutral-100 mx-4 p-2 rounded-xl">
      {/* 뒤로 가기 아이콘 (옵션) */}
      <button className="p-2" onClick={() => router.back()}>
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
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // 검색어 업데이트
        className="flex-grow bg-neutral-100 border-none outline-none px-4 py-1 text-gray-700 text-lg"
      />

      {/* 검색 버튼 */}
      <button
        onClick={handleSearch} // 버튼 클릭 시 라우팅
        className="bg-white text-black font-semibold px-4 py-2 rounded-2xl hover:bg-blue-500 hover:text-white"
      >
        검색
      </button>
    </div>
  );
};

export default SearchBar;



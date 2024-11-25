"use client";
import React from "react";
import { Header, LeftSidebar, RightSidebar, SearchBar } from "@/components";

const SearchLayout = ({ children }) => {
  return (
    <div>
      {/* 상단 헤더 */}
      <Header />

      {/* 좌우 고정 레이아웃 및 검색 바 */}
      <div className="z-10 min-h-screen flex space-x-4">
        {/* 좌측 사이드바 */}
        <LeftSidebar />

        {/* 메인 콘텐츠 영역 */}
        <div className="h-screen flex flex-col flex-1 p-4">
          {/* 상단 검색 바 고정 */}
          <div className="sticky top-0 z-10">
            <SearchBar />
          </div>

          {/* 검색 결과(children) 스크롤 가능 영역 */}
          <div className="overflow-y-auto p-4 space-y-4 flex-grow">
            {children}
          </div>
        </div>

        {/* 우측 사이드바 */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default SearchLayout;
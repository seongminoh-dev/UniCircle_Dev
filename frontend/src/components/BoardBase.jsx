"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { deletePost } from "@/services/Board";

// About DayJS
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko"; // 한국어 로케일 추가
dayjs.extend(relativeTime);
dayjs.locale("ko");

const BoardBase = ({ board, isPreview = false }) => {
  const router = useRouter();
  const auth = useAuth();
  // 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 상태를 관리합니다.

  // 데이터 처리
  const { userNickName: nickname, circleName: circle, board: boardData, circleId : circleNameTemp } = board;
  const title = boardData.title ?? "오류";
  const content = boardData.content ?? "내용을 불러오는데 실패했습니다.";
  const circleId = boardData.circleId ?? 0;
  const isAdmin = (boardData.userId === auth.user.userId ?? 0) ?? false;
  const visibility = boardData.visibility ?? "PUBLIC";
  const timestamp = boardData.createdAt ?? null;
  const postId = boardData.postId ?? 0;

  // 시간 포맷 함수
  const formatTimestamp = (timestamp) => {
    const now = dayjs();
    const postTime = dayjs(timestamp);

    if (now.diff(postTime, "hour") < 48) {
      return postTime.fromNow();
    } else {
      return postTime.format("YYYY년 MM월 DD일");
    }
  };

  // 메뉴 관련 핸들러 함수
  const handleToggleMenu = (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    setIsMenuOpen((prev) => !prev);
  };

  // 게시글 수정 버튼 호출시
  const handleEditPost = (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    alert("게시글 수정 기능은 준비중입니다!");
    setIsMenuOpen((prev) => !prev);
  };

  // 게시글 삭제 버튼 호출시
  const handleDeletePost = async (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    if (confirm("게시글은 삭제하면 복원할 수 없습니다. 정말 삭제하시겠습니까?")){
      try{
        await deletePost(postId);
        alert("삭제되었습니다");
        router.back();
      }catch{
        alert("게시글 삭제에 실패했습니다. 잠시후 다시 시도해주세요.");
      }
      
    }else{
      
    }
    
  };

  // 동아리 클릭 핸들러
  const handleCircleClick = (event) => {
    event.stopPropagation();
    router.push(`/circle-detail/${circleId}`);
  };

  // Content 처리: Preview 모드일 경우 자르기
  const displayContent = !content
    ? "내용을 불러올 수 없습니다."
    : isPreview && content.length > 100
    ? content.slice(0, 100) + "..."
    : content;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-4 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        {/* Contents */}
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold">{nickname}</h3>
          <span className="border-l-2 border-gray-300 h-5 mx-2"></span> {/* 세로선 */}
          <span className="text-sm text-gray-500 cursor-pointer" onClick={handleCircleClick}>
            {circle ?? circleNameTemp ?? "동아리"}
          </span>
        </div>
        {/* Menu Button */}
        {!isPreview && isAdmin && (
          <div className="text-gray-500 relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleToggleMenu} className="cursor-pointer">
              <path d="M12 7.75C11.0335 7.75 10.25 6.9665 10.25 6C10.25 5.0335 11.0335 4.25 12 4.25C12.9665 4.25 13.75 5.0335 13.75 6C13.75 6.9665 12.9665 7.75 12 7.75ZM12 13.75C11.0335 13.75 10.25 12.9665 10.25 12C10.25 11.0335 11.0335 10.25 12 10.25C12.9665 10.25 13.75 11.0335 13.75 12C13.75 12.9665 12.9665 13.75 12 13.75ZM10.25 18C10.25 18.9665 11.0335 19.75 12 19.75C12.9665 19.75 13.75 18.9665 13.75 18C13.75 17.0335 12.9665 16.25 12 16.25C11.0335 16.25 10.25 17.0335 10.25 18Z" fill="#14142B"/>
            </svg>
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 bg-white shadow-md rounded p-2 z-10" style={{ minWidth: "150px", top: "24px" }}> 
                <button onClick={handleEditPost} className="w-full text-left hover:bg-gray-200 p-2">게시글 수정</button>
                <button onClick={handleDeletePost} className="w-full text-left hover:bg-gray-200 p-2">게시글 삭제</button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Title & Content */}
      <h2 className="text-xl font-bold mb-2 mt-3">{title}</h2>
      <p className={`text-gray-700 mb-4 ${isPreview ? "line-clamp-3" : ""}`}>{displayContent}</p>
      {/* Timestamp */}
      <p className="text-sm text-gray-400">{formatTimestamp(timestamp)}{visibility === "PUBLIC" ? ", 전체 공개" : ", 동아리원 공개"}</p>
    </div>
  );
};

export default BoardBase;


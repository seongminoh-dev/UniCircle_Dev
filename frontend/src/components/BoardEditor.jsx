"use client";

import { useState } from "react";
import { useAuth } from "@/hooks";
import { createBoard } from "@/services";

const BoardEditor = ({ circleId, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC"); // visibility 상태
  const auth = useAuth();

  const handleUpload = async () => {
    if (title.trim() === "" || content.trim() === "") {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const boardData = {
      userId: auth.user.userId,
      circleId,
      title,
      content,
      visibility,
    };

    try {
      const response = await createBoard(boardData);
      console.log("게시글 생성 완료:", response);
      setTitle("");
      setContent("");
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      alert("게시글 생성 중 오류가 발생했습니다.");
    }
  };

  // visibility 토글 함수
  const toggleVisibility = () => {
    setVisibility((prev) => (prev === "PUBLIC" ? "PRIVATE" : "PUBLIC"));
  };
  return (
    <div className="border border-gray-200 w-[500px] rounded-lg shadow-md p-4 max-w-lg mx-auto relative bg-white">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="닫기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 cursor-pointer">게시글 작성하기</h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">공개 상태: {visibility}</span>
        <button
          onClick={toggleVisibility}
          className="text-white bg-gray-500 hover:bg-gray-600 rounded-md px-3 py-1 text-sm"
        >
          {visibility === "PUBLIC" ? "비공개로 변경" : "공개로 변경"}
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요..."
        className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요..."
        className="w-full h-96 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
      ></textarea>

      <div className="mt-6">
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 focus:outline-none"
        >
          업로드
        </button>
      </div>
    </div>
  );
};

export default BoardEditor;
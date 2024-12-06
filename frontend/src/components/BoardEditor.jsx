"use client";

import { useState } from "react";
import { useAuth } from "@/hooks";
import { createBoard } from "@/services"; // 이미 multipart/form-data 방식으로 구현된 createBoard 함수

const BoardEditor = ({ circleId, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // 게시글 내용
  const auth = useAuth(); // auth를 통해 userId 등을 가져올 수 있다고 가정

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
      visibility: "PUBLIC", // 필요하다면 동적으로 변경
      // createBoard 함수에서 hashtagId, isNotice는 기본값으로 넣으므로 생략 가능
    };

    try {
      const response = await createBoard(boardData);
      console.log("게시글 생성 완료:", response);
      setTitle("");
      setContent("");
      if (onClose) onClose(); // 모달 닫기 등의 동작
    } catch (error) {
      console.error(error);
      alert("게시글 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="border border-gray-200 w-[500px] rounded-lg shadow-md p-4 max-w-lg mx-auto relative bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 cursor-pointer">게시글 작성하기</h2>
      </div>

      {/* Title Input */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요..."
        className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Textarea (Content) */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요..."
        className="w-full h-96 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
      ></textarea>

      {/* Upload Icon */}
      <div className="flex items-center justify-start mt-4">
        <button
          className="flex items-center text-gray-500 hover:text-blue-500 focus:outline-none"
          onClick={() => alert("파일 업로드 기능")}
        >
        </button>
      </div>

      {/* Upload Button */}
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
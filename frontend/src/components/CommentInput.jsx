"use client";

import { useState } from "react";

const CommentInput = ({ onSubmit }) => {
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (comment.trim() === "") {
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        onSubmit(comment);
        setComment(""); // 입력 필드 초기화
    };

  return (
    <div className="flex items-center bg-white shadow rounded-lg p-4 mb-6">
        <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
            onClick={handleSubmit}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-blue-600"
        >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4.5C1 3.11929 2.11929 2 3.5 2H12.5C13.8807 2 15 3.11929 15 4.5V9.5C15 10.8807 13.8807 12 12.5 12H8.68787L5.62533 14.6797C4.99168 15.2342 4 14.7842 4 13.9422V12H3.5C2.11929 12 1 10.8807 1 9.5V4.5ZM3.5 3C2.67157 3 2 3.67157 2 4.5V9.5C2 10.3284 2.67157 11 3.5 11H5V13.8981L8.31213 11H12.5C13.3284 11 14 10.3284 14 9.5V4.5C14 3.67157 13.3284 3 12.5 3H3.5Z" fill="#FFFFFF"/>
        </svg>
        댓글 입력
      </button>
    </div>
  );
};

export default CommentInput;

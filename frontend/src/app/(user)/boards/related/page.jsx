"use client";

import React, { useEffect, useState } from "react";
import BoardPreview from "@/components/BoardPreview";
import { getAllPosts } from "@/services/Board"; // getAllPosts 함수 불러오기

const Board = () => {
  const [boards, setBoards] = useState([]); // 게시글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getAllPosts(); // 서버에서 게시글 데이터 가져오기
        setBoards(data); // 상태에 데이터 설정
      } catch (err) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts(); // 초기 데이터 로드
  }, []);

  return (
    <div className="space-y-4">
      {loading && <p>로딩 중...</p>}
      {error && <p>{error}</p>}
      {!loading &&
        boards.map((board, index) => (
          <BoardPreview key={index} board={board} />
        ))}
    </div>
  );  
};

export default Board;

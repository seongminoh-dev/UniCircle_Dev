"use client";

import React, { useEffect, useState } from "react";
import BoardPreview from "@/components/BoardPreview";
import { getAllPosts } from "@/services/Board"; // getAllPosts 함수 불러오기
import { getEncounteredCircle } from "@/services";
import { useAuth } from "@/hooks";

const Board = () => {
  const [boards, setBoards] = useState([]); // 게시글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const auth = useAuth();

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getAllPosts(); // 서버에서 게시글 데이터 가져오기
        const member = await getEncounteredCircle(auth.user.email);
        const circle = member.map(item => item.circleId);
        const filteredData = data.filter((item) => {
        const { visibility, circleId } = item.board;
          //return visibility !== "PRIVATE" || circle.includes(circleId);
          return circle.includes(circleId);
        });
        setBoards(filteredData); // 상태에 데이터 설정
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
    <div className="space-y-4 px-2">
      <h2 className="text-2xl font-semibold text-gray-500 px-2 mb-2 mx-0">나와 관련된 게시물</h2>
      <div className="px-2 mx-0">
        {loading && <p>게시글을 불러오는 중...</p>}
        {error && <p>{error}</p>}
        {!loading && boards.length===0 && <p>나와 관련된 게시물이 없습니다. 동아리에 가입하고 다양한 게시물을 열람하세요!</p>}
        {!loading &&
          boards.map((board, index) => (
            <BoardPreview key={index} board={board} />
          ))}
      </div>
    </div>
  );  
};

export default Board;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Board from "@/components/Board";
import CommentInput from "@/components/CommentInput";
import CommentList from "@/components/CommentList";

// Mock 데이터 가져오기 함수
const fetchBoardData = async (id) => {
  // 여기에 API 호출을 추가하거나 데이터베이스에서 데이터를 가져오도록 구현
  // !!!!!!!!!!!!!!!!!!! 아래는 임시 데이터임 !!!!!!!!!!!!!!!!!!!!
  return {
    board:
        {
            id,
            nickname: '닉네임C',
            club: '사진 동아리',
            timestamp: '53분전',
            title: '동아리 소개 및 가입 안내',
            content: '이번 주말에 있을 동아리 활동 안내입니다.',
            tags: ['태그1', '태그2', '태그3'],
            views: 297,
            comments: 54,
        },
    
    comments: [
        {
            targetUsername: "unkind",
            content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare rutrum amet, a nunc mi lacinia in iaculis.",
            authorUsername: "lazyReplier",
            isCircleMember: true,
        },
        {
            targetUsername: "lazyReplier",
            content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare rutrum amet, a nunc mi lacinia in iaculis.",
            authorUsername: "kindHelper",
            isCircleMember: false,
        },
    ],
  };
};

const BoardPage = ({ params }) => {
  const { id } = params; // URL에서 ID 추출
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBoardData(id);
      setBoard(data.board);
      setComments(data.comments);
    };
    fetchData();
  }, [id]);

  const handleAddComment = (newComment) => {
    const newCommentObj = {
      targetUsername: "targetUser", // 임시 대상
      content: newComment,
      authorUsername: "newUser", // 작성자
      isCircleMember: true, // 테스트로 회원 여부 설정
    };
    setComments([newCommentObj, ...comments]); // 새로운 댓글 추가
  };

  if (!board) return <p>Loading...</p>; // 데이터 로딩 중

  return (
    <div className="p-6 min-h-screen space-y-6">
      {/* 게시글 */}
      <Board board={board} />

      {/* 댓글 입력 */}
      <CommentInput onSubmit={handleAddComment} />

      {/* 댓글 리스트 */}
      <CommentList comments={comments} />
    </div>
  );
};

export default BoardPage;

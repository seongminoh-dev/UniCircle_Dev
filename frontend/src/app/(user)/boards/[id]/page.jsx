"use client";

import { useState, useEffect } from "react";
import Board from "@/components/Board";
import CommentInput from "@/components/CommentInput";
import CommentList from "@/components/CommentList";
import { writeComment, getComment } from "@/services/Comment";
import { getPost } from "@/services/Board";
import { useAuth } from "@/hooks";



const BoardPage = ({ params }) => {
  const { id } = params; // URL에서 ID 추출
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const auth = useAuth();

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const boardData = await getPost(id);
        setBoard(boardData);
        const commentData = await getComment(id);
        setComments(commentData);
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async (newComment) => {
    const newCommentObj = {
      userId: auth.user.userId, // 임시 대상
      content: newComment,
      isCircleMember: true, // 테스트로 회원 여부 설정
    };
    try{
      await writeComment({postId:id,userId:auth.user.userId,visibility:"PUBLIC",content:newComment});
      setComments([newCommentObj, ...comments]); // 새로운 댓글 추가
    }catch (error) {
      console.error( error.message);
    }
  };

  if (!board) return <p>Loading...</p>; // 데이터 로딩 중

  return (
    <div className="p-6 min-h-screen space-y-6">
      {/* 게시글 */}
      {board && <Board board={board} />}

      {/* 댓글 입력 */}
      <CommentInput onSubmit={handleAddComment} />

      {/* 댓글 리스트 */}
      <CommentList comments={comments} />
    </div>
  );
};

export default BoardPage;


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Board from "@/components/Board";
import CommentInput from "@/components/CommentInput";
import CommentList from "@/components/CommentList";
import { writeComment, getComment, updateComment, deleteComment } from "@/services/Comment";
import { getCircleMembers } from "@/services/Circle";
import { getPost } from "@/services/Board";
import { useAuth } from "@/hooks";



const BoardPage = ({ params }) => {
  const { postId } = params; // URL에서 ID 추출
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [circle, setCircle] = useState([]);
  const [ boardGuard, setBoardGuard ] = useState(true);
  const auth = useAuth();
  const router = useRouter();

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const boardData = await getPost(postId);
        setBoard(boardData);
        const commentData = await getComment(postId);
        setComments(commentData);
        const circleData = await getCircleMembers(boardData.board.circleId);
        setCircle(circleData.map(item => item.userId));
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    };
    fetchData();
  }, [postId]);

  // board와 circle이 로드된 후 조건 확인
  useEffect(() => {
    if (board && circle.length > 0) {
      const isPrivate = board.board.visibility === "PRIVATE";
      const isUserInCircle = circle.includes(auth.user.userId);

      if (isPrivate && !isUserInCircle) {
        setBoardGuard(true);
      }else
        setBoardGuard(false);
    }
  }, [board, circle, auth.user.userId, router]);

  useEffect(() => {
    const updatedComments = comments.map((item) => {
      const isCircleMember = circle.includes(item.comment.userId);
      return {
        ...item,
        isCircleMember, // isCircleMember 추가
      };
    });
    setComments(updatedComments);
  }, [circle]);

  // 댓글 추가
  const handleAddComment = async (newComment) => {
    try{
      const result= await writeComment({postId,userId:auth.user.userId,visibility:"PUBLIC",content:newComment,});
      result.isCircleMember = circle.includes(auth.user.userId);
      setComments([ ...comments,result]); // 새로운 댓글 추가
    }catch (error) {
      console.error( error.message);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.comment.commentId !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  // 댓글 수정
  const handleUpdateComment = async (commentId, updatedContent) => {
    try {
      await updateComment({commentId,postId,userId:auth.user.userId,visibility:"PUBLIC",content:updatedContent,})
      setComments(
        comments.map((comment) =>
          comment.comment.commentId === commentId
            ? { ...comment, comment: { ...comment.comment, content: updatedContent } }
            : comment
        )
      );
      console.log("done");
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  
  if (!board || !circle || !comments) return <p>게시글을 불러오는 중...</p>; // 데이터 로딩 중

  if(boardGuard) return null;

    return (
    <div className="p-6 min-h-screen space-y-6">
      {/* 게시글 */}
      {board && <Board board={board} />}
      {/* 댓글 입력 */}
      <CommentInput onSubmit={handleAddComment} />
      {/* 댓글 리스트 */}
      <CommentList comments={comments}  onDelete={handleDeleteComment} onUpdate={handleUpdateComment} />
    </div>
    );
  
};

export default BoardPage;



"use client";
import { useState } from "react";
import { useAuth } from "@/hooks";

// About DayJS
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko"; // 한국어 로케일 추가
dayjs.extend(relativeTime);
dayjs.locale("ko");

const formatTimestamp = (timestamp) => {
  const now = dayjs();
  const postTime = dayjs(timestamp);

  if (now.diff(postTime, "hour") < 48) {
    return postTime.fromNow();
  } else {
    return postTime.format("YYYY년 MM월 DD일");
  }
};

const CommentItem = ({ comment, onDelete, onUpdate }) => {
  const auth = useAuth();
  const { comment: commentData, userNickName, isCircleMember } = comment;
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(commentData.content);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = () => {
    onUpdate(commentData.commentId, updatedContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(commentData.commentId);
  };

  return (
    <div className="flex mb-4">
      {/* Left Color Indicator */}
      <div
        className={`w-2 h-auto ${
          isCircleMember ? "bg-blue-300" : "bg-orange-300"
        } rounded-tl-lg rounded-bl-lg`}
      ></div>

      {/* Comment Content */}
      <div className="bg-white flex-grow shadow rounded-lg p-4">
        {!isEditing ? (
          <>
            <p className="font-semibold mb-2">
              <span className="ml-2 text-gray-700">{commentData.content}</span>
            </p>
            <div className="text-sm text-gray-500 flex justify-between items-center mt-2 ml-2">
              <span>
                {userNickName}
                {isCircleMember === true ? "(동아리원)" : "(방문자)"} |{" "}
                {formatTimestamp(commentData.createdAt)}
              </span>
              {auth.user.userId === commentData.userId && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleEditToggle}
                    className="text-blue-500 hover:underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              className="w-full border rounded p-2"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                저장
              </button>
              <button
                onClick={handleEditToggle}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                취소
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CommentList = ({ comments, onDelete, onUpdate }) => {
  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <CommentItem
          key={index}
          comment={comment}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default CommentList;


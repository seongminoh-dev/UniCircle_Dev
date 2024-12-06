"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko"; // 한국어 로케일 추가
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime); // relativeTime 플러그인 활성화
dayjs.locale("ko"); // 로케일을 한국어로 설정
const BoardBase = ({ board, isPreview = false }) => {
  const router = useRouter(); // Next.js 라우터 훅 사용

  let { userId: nickname, circleId: circle, createdAt: timestamp, title, content, comments } = board;
  comments = 0;

  // Content 처리: Preview 모드일 경우 자르기
  const displayContent = isPreview && content.length > 100 ? content.slice(0, 100) + "..." : content;

  // 시간 포맷 함수
  const formatTimestamp = (timestamp) => {
    const now = dayjs();
    const postTime = dayjs(timestamp);

    if (now.diff(postTime, "hour") < 48) {
      return postTime.fromNow(); // 48시간 이내: 상대 시간 (~분 전, ~시간 전 등)
    } else {
      return postTime.format("YYYY년 MM월 DD일"); // 48시간 이후: 년/월/일
    }
  };

  const handleCircleClick = (event) => {
    event.stopPropagation();
    router.push(`/circle-detail/${circle}`);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-4 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold">USER_{nickname}</h3>
          <span className="border-l-2 border-gray-300 h-5 mx-2"></span> {/* 세로선 */}
          <span className="text-sm text-gray-500 cursor-pointer" onClick={handleCircleClick}>
            CIRCLE_{circle}
          </span>
        </div>
        <div className="text-gray-500">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 7.75C11.0335 7.75 10.25 6.9665 10.25 6C10.25 5.0335 11.0335 4.25 12 4.25C12.9665 4.25 13.75 5.0335 13.75 6C13.75 6.9665 12.9665 7.75 12 7.75ZM12 13.75C11.0335 13.75 10.25 12.9665 10.25 12C10.25 11.0335 11.0335 10.25 12 10.25C12.9665 10.25 13.75 11.0335 13.75 12C13.75 12.9665 12.9665 13.75 12 13.75ZM10.25 18C10.25 18.9665 11.0335 19.75 12 19.75C12.9665 19.75 13.75 18.9665 13.75 18C13.75 17.0335 12.9665 16.25 12 16.25C11.0335 16.25 10.25 17.0335 10.25 18Z" fill="#14142B"/>
        </svg>
        </div>
      </div>

      {/* Title & Content */}
      <h2 className="text-xl font-bold mb-2 mt-3">{title}</h2>
      <p className={`text-gray-700 mb-4 ${isPreview ? "line-clamp-3" : ""}`}>{displayContent}</p>

      {/* Timestamp */}
      <p className="text-sm text-gray-400">{formatTimestamp(timestamp)}</p>
    </div>
  );
};

export default BoardBase;

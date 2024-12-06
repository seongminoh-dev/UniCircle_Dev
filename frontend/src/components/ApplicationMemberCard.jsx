"use client";

import MemberCard from "./MemberCard";
import dayjs from "dayjs";

// 가입신청 멤버 카드
const ApplicationMemberCard = ({ nickname, date, onViewForm, onApprove, onReject }) => {
  return (
    <MemberCard nickname={nickname} date={`${dayjs(date).format("YYYY년 MM월 DD일")} 가입 신청`}>
      <button
        onClick={onViewForm}
        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
      >
        가입 양식 보기
      </button>
      <button
        onClick={onApprove}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
      >
        수락
      </button>
      <button
        onClick={onReject}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
      >
        거절
      </button>
    </MemberCard>
  );
};

export default ApplicationMemberCard;

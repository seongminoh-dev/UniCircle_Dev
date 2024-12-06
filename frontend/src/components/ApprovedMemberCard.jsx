"use client";

import MemberCard from "./MemberCard";

// 가입한 멤버 카드
const ApprovedMemberCard = ({ nickname, email, onViewForm, onLeave }) => {
  return (
    <MemberCard nickname={nickname} info={`${email}`}>
      <button
        onClick={onViewForm}
        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
      >
        가입 양식 보기
      </button>
      <button
        onClick={onLeave}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
      >
        동아리 탈퇴
      </button>
    </MemberCard>
  );
};

export default ApprovedMemberCard;

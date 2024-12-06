"use client";

import MemberCard from "@/components/MemberCard";

const MemberList = () => {
  // Example data for demonstration
  const admin = { nickname: "닉네임", date: "2024.07.26 가입" };
  const members = [
    { nickname: "닉네임", date: "2024.07.26 가입" },
    { nickname: "닉네임", date: "2024.07.26 가입" },
    { nickname: "닉네임", date: "2024.07.26 가입" },
    { nickname: "닉네임", date: "2024.07.26 가입" },
    { nickname: "닉네임", date: "2024.07.26 가입" },
    { nickname: "닉네임", date: "2024.07.26 가입" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">동아리 회원 목록 | 농구 동아리</h1>

      {/* Admin Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">관리자</h2>
        <MemberCard nickname={admin.nickname} date={admin.date} />
      </div>

      {/* Member Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">회원 목록</h2>
        {members.map((member, index) => (
          <MemberCard
            key={index}
            nickname={member.nickname}
            date={member.date}
          />
        ))}
      </div>
    </div>
  );
};

export default MemberList;

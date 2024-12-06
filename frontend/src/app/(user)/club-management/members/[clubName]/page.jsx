"use client";

import ApplicationMemberCard from "@/components/ApplicationMemberCard";
import ApprovedMemberCard from "@/components/ApprovedMemberCard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const applications = [
  { nickname: "닉네임1", date: "2024.07.26" },
  { nickname: "닉네임2", date: "2024.07.26" },
];

const members = [
  { nickname: "닉네임3", date: "2024.07.26" },
  { nickname: "닉네임4", date: "2024.07.26" },
];

const MemberManagement = ({ params }) => {
  // const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem("auth-token"); // 로컬 저장소에서 인증 토큰 가져오기

  //   if (!token) {
  //     alert("로그인이 필요합니다.");
  //     router.push("/login"); // 로그인 페이지로 리다이렉트
  //   }

  //   // 필요시 추가 검증 (예: 관리자 권한 확인)
  //   const user = verifyToken(token);
  //   if (!user || !user.isAdmin) {
  //     alert("권한이 없습니다.");
  //     router.push("/unauthorized"); // 권한 없음 페이지로 리다이렉트
  //   }
  // }, []);
  const { circleName } = params;
  
  const handleViewForm = (nickname) => {
    alert(`${nickname}의 가입 양식을 확인합니다.`);
  };

  const handleApprove = (nickname) => {
    alert(`${nickname}의 가입 신청을 수락합니다.`);
  };

  const handleReject = (nickname) => {
    alert(`${nickname}의 요청을 거절합니다.`);
  };

  const handleLeave = (nickname) => {
    alert(`${nickname}의 동아리 탈퇴를 처리합니다.`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        동아리 회원 관리
        <span className="border-l border-gray-300 mx-3 h-6"></span> {/* 세로 구분선 */}
        <span className="text-lg text-gray-500">{circleName}</span>
      </h1>

      {/* 가입 신청 목록 */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">가입 신청 목록</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {applications.map((app, index) => (
            <ApplicationMemberCard
              key={index}
              nickname={app.nickname}
              date={app.date}
              onViewForm={() => handleViewForm(app.nickname)}
              onApprove={() => handleApprove(app.nickname)}
              onReject={() => handleReject(app.nickname)}
            />
          ))}
        </div>
      </section>

      {/* Divider */}
      <hr className="my-4 border-gray-300" />

      {/* 회원 목록 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">회원 목록</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {members.map((member, index) => (
            <ApprovedMemberCard
              key={index}
              nickname={member.nickname}
              date={member.date}
              onViewForm={() => handleViewForm(member.nickname)}
              onLeave={() => handleLeave(member.nickname)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MemberManagement;

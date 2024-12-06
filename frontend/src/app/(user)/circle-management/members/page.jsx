"use client";

import ApplicationMemberCard from "@/components/ApplicationMemberCard";
import ApprovedMemberCard from "@/components/ApprovedMemberCard";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks";
import { getAccessToken } from "@/services/Token";
import { getCircleById } from "@/services";
import { getAllFormByCircleId } from "@/services/AdmissionFormAPI";
import { getCircleMembers } from "@/services/Circle";

const MemberManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const circleId = searchParams.get("circleId");
  
  const [applications, setApplications] = useState([]);
  const [members, setMembers] = useState([]);
  const [circleName, setCircleName] = useState("");
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const token = getAccessToken();
    if (!circleId) {
      alert("잘못된 접근입니다. circleId가 필요합니다.");
      router.push("/"); 
      return;
    }

    const fetchData = async () => {
      try {
        // 동아리 정보 가져오기
        const circleInfoData = await getCircleById(circleId);
        setCircleName(circleInfoData.name);

        // 입부신청서 목록 가져오기
        const formsData = await getAllFormByCircleId(circleId);
        const pendingForms = formsData.filter(form => form.status === 'PENDING');
        const mappedApplications = pendingForms.map(form => ({
          nickname: `User${form.userId}`,
          date: form.createdAt
        }));
        setApplications(mappedApplications);

        // 동아리 회원 목록 가져오기
        const membersData = await getCircleMembers(circleId);
        const mappedMembers = membersData.map(user => ({
          nickname: user.nickname,
          date: user.joinDate
        }));
        setMembers(mappedMembers);

      } catch (error) {
        console.error(error);
        alert("데이터 로딩에 실패했습니다.");
      }
    };

    fetchData();
  }, [circleId, router, auth.isAuthenticated]);

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
        <span className="border-l border-gray-300 mx-3 h-6"></span>
        <span className="text-lg text-gray-500">{circleName}</span>
      </h1>

      {/* 가입 신청 목록 */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">가입 신청 목록</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {applications.length === 0 ? (
            <p className="text-gray-500">아직 가입 신청이 없습니다.</p>
          ) : (
            applications.map((app, index) => (
              <ApplicationMemberCard
                key={index}
                nickname={app.nickname}
                date={app.date}
                onViewForm={() => handleViewForm(app.nickname)}
                onApprove={() => handleApprove(app.nickname)}
                onReject={() => handleReject(app.nickname)}
              />
            ))
          )}
        </div>
      </section>

      {/* Divider */}
      <hr className="my-4 border-gray-300" />

      {/* 회원 목록 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">회원 목록</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {members.length === 0 ? (
            <p className="text-gray-500">아직 회원 목록이 없습니다.</p>
          ) : (
            members.map((member, index) => (
              <ApprovedMemberCard
                key={index}
                nickname={member.nickname}
                date={member.date}
                onViewForm={() => handleViewForm(member.nickname)}
                onLeave={() => handleLeave(member.nickname)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default MemberManagement;

"use client";

import ApplicationMemberCard from "@/components/ApplicationMemberCard";
import ApprovedMemberCard from "@/components/ApprovedMemberCard";
import ModalWrapper from "@/components/ModalWrapper"; // Import the ModalWrapper component
import ApplyFormViewer from "@/components/ApplyFormViewer"; // Import the ApplyFormViewer component
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks";
import { getAccessToken } from "@/services/Token";
import { getCircleById } from "@/services";
import { getAllFormByCircleId } from "@/services/AdmissionFormAPI";
import { getCircleMembers } from "@/services";

const MemberManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const circleId = searchParams.get("circleId");

  const [applications, setApplications] = useState([]);
  const [members, setMembers] = useState([]);
  const [circleName, setCircleName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState(null); // State to manage the form data for the modal
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
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
        const pendingForms = formsData.filter(
          (form) => form.status === "PENDING"
        );
        // const mappedApplications = pendingForms.map((form) => ({
        //   userId: form.userId,
        //   nickname: `User${form.userId}`,
        //   date: form.createdAt,
        //   formData: form.formContent,
        // }));
        setApplications(pendingForms);

        // 동아리 회원 목록 가져오기
        const membersData = await getCircleMembers(circleId);
        const mappedMembers = membersData.map((user) => ({
          nickname: user.nickname,
          date: "2024년 12월 5일",
        }));
        setMembers(mappedMembers);
      } catch (error) {
        console.error(error);
        alert("데이터 로딩에 실패했습니다.");
      }
    };

    fetchData();
  }, [circleId]);

  const handleViewForm = (formData) => {
    console.log("폼:"+ formData);
    setSelectedFormData(formData); // Set the selected form data
    setModalOpen(true); // Open the modal
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
                nickname={app.nickname} // !!!!!!!!!!!!!! 닉네임 처리 !!!!!!!!!!!
                date={app.createdAt}
                onViewForm={() => handleViewForm(app.formContent)} // Trigger modal on click
                onApprove={() => handleApprove(app.formId)}
                onReject={() => handleReject(app.userId)}
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
                onLeave={() => handleLeave(member.nickname)}
              />
            ))
          )}
        </div>
      </section>

      {/* Modal for Viewing Forms */}
      <ModalWrapper isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ApplyFormViewer formData={selectedFormData} /> {/* Pass selected form data */}
      </ModalWrapper>
    </div>
  );
};

export default MemberManagement;

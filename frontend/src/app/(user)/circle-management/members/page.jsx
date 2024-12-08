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
import { getAllFormByCircleId } from "@/services/AdmissionForm";
import { getCircleMembers } from "@/services";
import { updateAdmissionFormStatus } from "@/services/AdmissionForm";
import { acceptUserByFormId } from "@/services/AdmissionForm";
import { getAdmissionForm, rejectForm } from "@/services/AdmissionForm";
import { removeUserFromCircle } from "@/services/Circle";


const MemberManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const circleId = searchParams.get("circleId");

  const [applications, setApplications] = useState([]);
  const [memberForms, setMemberForms] = useState([]);
  const [members, setMembers] = useState([]);
  const [circleName, setCircleName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState({
    id:-1,
    title: "",
    description: "",
    questions: [],
  });
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
          (admission) => admission.form.status === "PENDING"
        );
        console.log(formsData);
        setApplications(pendingForms);

        const acceptedForms = formsData.filter(
          (admission) => admission.form.status === "ACCEPTED"
        );
        setMemberForms(acceptedForms);

        // 동아리 회원 목록 가져오기
        const membersData = await getCircleMembers(circleId);
        const mappedMembers = membersData.map((user) => ({
          id: user.userId,
          nickname: user.nickname,
          email: user.email,
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
    let formContent = formData;
  
    // JSON 문자열인지 확인 후 파싱
    if (typeof formContent === "string") {
      try {
        formContent = JSON.parse(formData);
      } catch (error) {
        console.error("Invalid JSON format in formContent:", formContent);
        return;
      }
    }
    console.log(formContent);
  
    // 상태 업데이트
    setSelectedFormData({
      id: formData.formId,
      title: formContent.title || "No Title",
      description: formContent.description || "No Description",
      questions: formContent.questions || [],
    });
  
    // 상태 업데이트 이후 모달 열기
    setTimeout(() => {
      setModalOpen(true);
    }, 0); // 0ms 지연으로 상태 업데이트 완료 후 모달 열기
  };
  const handleApprove = (formData) => {
    try{
      acceptUserByFormId(formData.form.formId);
      alert(`${formData.form.email}의 가입 신청을 수락합니다.`);
    }catch{
      alert("가입 신청 수락에 실패했습니다.");
    }
  };

  const handleReject = (formData) => {
    rejectForm(formData.form.formId);
    alert(`${formData.form.email}의 요청을 거절합니다.`);
  };

  const handleLeave = (userEmail) => {
    alert(`${userEmail}의 동아리 탈퇴를 처리합니다.`);
    removeUserFromCircle(circleId ,userEmail);
  };

  const handleAcceptInForm = (formId) => {
    try{
      acceptUserByFormId(formId);
      alert(`가입 신청을 수락합니다.`);
    }catch{
      alert("가입 신청 수락에 실패했습니다.");
    }
  };

  const handleViewMemberForm = (userId) => {
    // memberForms에서 userId와 일치하는 formData 찾기
    const matchedForm = memberForms.find((form) => form.userId === userId);
    if (matchedForm) {
      handleViewForm(matchedForm); // handleViewForm 호출
    } else {
      alert("해당 회원의 폼 데이터를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        동아리 회원 관리
        <span className="border-l border-gray-300 mx-3 h-6"></span>
        <span className="text-lg text-gray-500">{circleName}</span>
      </h1>

      {/* 가입 신청 목록 */}
      <section className="bg-gray-100 p-4 rounded-lg ">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">가입 신청 목록</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4">
            {applications.length === 0 ? (
              <p className="text-gray-500">아직 가입 신청이 없습니다.</p>
            ) : (
              applications.map((app, index) => (
                <ApplicationMemberCard
                  key={index}
                  nickname={"임시 닉네임"} // 닉네임 처리
                  date={app.createdAt}
                  onViewForm={() => handleViewForm(app)} // Trigger modal on click
                  onApprove={() => handleApprove(app)}
                  onReject={() => handleReject(app)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-10 my-8" />

      {/* 회원 목록 */}
      <section className="bg-gray-100 p-4 rounded-lg ">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">회원 목록</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4">
            {members.length === 0 ? (
              <p className="text-gray-500">아직 회원 목록이 없습니다.</p>
            ) : (
              members.map((member, index) => (
                <ApprovedMemberCard
                  key={index}
                  nickname={member.nickname}
                  email={member.email}
                  onViewForm={()=> handleViewMemberForm(member.id)}
                  onLeave={() => handleLeave(member.email)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal for Viewing Forms */}
      <ModalWrapper isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
      {selectedFormData? (
        <ApplyFormViewer formData={selectedFormData} onClickAccept={handleAcceptInForm} />
      ) : (
        <div>로딩 중...</div>
      )}
      </ModalWrapper>
    </div>

  );
};

export default MemberManagement;

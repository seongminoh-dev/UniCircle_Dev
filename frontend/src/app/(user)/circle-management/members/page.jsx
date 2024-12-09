"use client";

import ApplicationMemberCard from "@/components/ApplicationMemberCard";
import ApprovedMemberCard from "@/components/ApprovedMemberCard";
import ModalWrapper from "@/components/ModalWrapper";
import ApplyFormViewer from "@/components/ApplyFormViewer";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks";
import { getAccessToken } from "@/services/Token";
import { getCircleById } from "@/services";
import { getAllFormByCircleId } from "@/services/AdmissionForm";
import { getCircleMembers } from "@/services";
import { updateAdmissionFormStatus } from "@/services/AdmissionForm";
import { acceptUserByFormId, rejectForm } from "@/services/AdmissionForm";
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
    id: -1,
    title: "",
    description: "",
    questions: [],
  });
  const auth = useAuth();

  // **데이터 로딩 함수**
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

  useEffect(() => {
    if (!auth.isAuthenticated) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
      return;
    }

    if (!circleId) {
      alert("잘못된 접근입니다. circleId가 필요합니다.");
      router.push("/");
      return;
    }

    fetchData();
  }, [circleId]);

  const handleViewForm = (formData) => {
    let data = formData;

    // JSON 문자열인지 확인 후 파싱
    if (typeof formData === "string") {
      try {
        data = JSON.parse(formData).form;
      } catch (error) {
        console.error("Invalid JSON format in formContent:", data);
        return;
      }
    }
    let content = JSON.parse(data.form.formContent);
    // 상태 업데이트
    const updatedFormData = {
      id: data.form.formId,
      title: content.title || "No Title",
      description: content.description || "No Description",
      questions: content.questions || [],
    };

    setSelectedFormData(updatedFormData);
    setModalOpen(true);
  };

  // **가입 신청 수락**
  const handleApprove = async (formData) => {
    try {
      await acceptUserByFormId(formData.form.formId);
      alert(`${formData.form.email}의 가입 신청을 수락했습니다.`);
      await fetchData(); // 데이터 새로고침
    } catch (error) {
      console.error(error);
      alert("가입 신청 수락에 실패했습니다.");
    }
  };

  // **가입 신청 거절**
  const handleReject = async (formData) => {
    try {
      await rejectForm(formData.form.formId);
      alert(`${formData.form.email}의 요청을 거절했습니다.`);
      await fetchData(); // 데이터 새로고침
    } catch (error) {
      console.error(error);
      alert("가입 신청 거절에 실패했습니다.");
    }
  };

  // **회원 탈퇴 처리**
  const handleLeave = async (userEmail) => {
    try {
      await removeUserFromCircle(circleId, userEmail);
      alert(`${userEmail}의 동아리 탈퇴를 처리했습니다.`);
      await fetchData(); // 데이터 새로고침
    } catch (error) {
      console.error(error);
      alert("동아리 탈퇴 처리에 실패했습니다.");
    }
  };

  // **가입 신청 폼에서 수락 처리**
  const handleAcceptInForm = async (formId) => {
    try {
      await acceptUserByFormId(formId);
      alert(`가입 신청을 수락했습니다.`);
      setModalOpen(false);
      await fetchData(); // 데이터 새로고침
    } catch (error) {
      console.error(error);
      alert("가입 신청 수락에 실패했습니다.");
    }
  };

  const handleViewMemberForm = (userId) => {
    const matchedForm = memberForms.find((data) => data.form.userId === userId);
    if (matchedForm) {
      handleViewForm(matchedForm);
    } else {
      alert("해당 회원의 폼 데이터를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold text-gray-500 mb-6 flex items-center">
        동아리 회원 관리
        <span className="border-l border-gray-300 mx-3 h-6"></span>
        <span className="text-lg text-gray-500">{circleName}</span>
      </h1>

      {/* 가입 신청 목록 */}
      <section className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">가입 신청 목록</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4">
            {applications.length === 0 ? (
              <p className="text-gray-500">아직 가입 신청이 없습니다.</p>
            ) : (
              applications.map((app, index) => (
                <ApplicationMemberCard
                  key={index}
                  nickname={app.userNickName}
                  date={app.createdAt}
                  onViewForm={() => handleViewForm(app)}
                  onApprove={() => handleApprove(app)}
                  onReject={() => handleReject(app)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 회원 목록 */}
      <section className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">회원 목록</h2>
        <div className="max-h-96 overflow-y-auto">
          {members.length === 0 ? (
            <p className="text-gray-500">아직 회원 목록이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2">
              {members.map((member, index) => (
                <ApprovedMemberCard
                  key={index}
                  nickname={member.nickname}
                  email={member.email}
                  onViewForm={() => handleViewMemberForm(member.id)}
                  onLeave={() => handleLeave(member.email)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for Viewing Forms */}
      <ModalWrapper isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        {selectedFormData ? (
          <ApplyFormViewer
            formData={selectedFormData}
            onClickAccept={() => handleAcceptInForm(selectedFormData.id)}
          />
        ) : (
          <div>로딩 중...</div>
        )}
      </ModalWrapper>
    </div>
  );
};

export default MemberManagement;

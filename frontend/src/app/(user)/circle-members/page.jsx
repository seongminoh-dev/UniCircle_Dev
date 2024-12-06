"use client";

import MemberCard from "@/components/MemberCard";
import { getCircleById } from "@/services";
import { getCircleMembers } from "@/services";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks";
import { getAccessToken } from "@/services/Token";

const MemberList = () => {
  // Example data for demonstration
  const searchParams = useSearchParams();
  const circleId = searchParams.get("circleId");


  const [admin, setAdmin] = useState({});
  const [members, setMembers] = useState([]);
  const [circleName, setCircleName] = useState("");
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
        setAdmin({
            nickname: circleInfoData.adminUser.nickname,
            date: circleInfoData.adminUser.createdAt,
        });

        // 동아리 회원 목록 가져오기
        const membersData = await getCircleMembers(circleId);
        const mappedMembers = membersData.map((user) => ({
          nickname: user.nickname,
          date: user.createdAt,
        }));
        setMembers(mappedMembers);
      } catch (error) {
        console.error(error);
        alert("데이터 로딩에 실패했습니다.");
      }
    };

    fetchData();
  }, [circleId]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        동아리 회원 목록
        <span className="border-l border-gray-300 mx-3 h-6"></span>
        <span className="text-lg text-gray-500">{circleName}</span>
      </h1>

      {/* 가입 신청 목록 */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">관리자</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
        <MemberCard nickname={admin.nickname} date={admin.date} />
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
                <MemberCard
                key={index}
                nickname={member.nickname}
                date={member.date}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default MemberList;

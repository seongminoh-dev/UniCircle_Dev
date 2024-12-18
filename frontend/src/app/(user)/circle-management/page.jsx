"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import CirclePreview from "@/components/CirclePreview";
import CircleManagementPreview from "@/components/CircleManagementPreview";
import { getEncounteredCircle } from "@/services";

const CircleManagementPage = () => {
  const router = useRouter();
  const auth = useAuth();
  
  const [joinedCircles, setJoinedCircles] = useState([]);
  const [managedCircles, setManagedCircles] = useState([]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response_encountered = await getEncounteredCircle(auth.user.email);

        // circle.admin.email이 auth.user.email과 같으면 관리하는 동아리
        // 아니면 가입한 동아리로 분류
        const userJoined = response_encountered
          .filter(circle => circle.adminUser.email !== auth.user.email)
          .map(circle => ({
            id: circle.circleId,
            name: circle.name,
            image: circle.imageUrl || "https://via.placeholder.com/150",
            tags: circle.hashtags || []
          }));
        
        const userManaged = response_encountered
          .filter(circle => circle.adminUser.email === auth.user.email)
          .map(circle => ({
            id: circle.circleId,
            name: circle.name,
            image: circle.imageUrl || "https://via.placeholder.com/150",
            tags: circle.hashtags || []
          }));

        setJoinedCircles(userJoined);
        setManagedCircles(userManaged);
      } catch (error) {
        console.error(error);
        alert("데이터 로딩에 실패했습니다.");
      }
    };

    fetchData();
  }, [auth.isAuthenticated, auth.user, router]);

  const handleManageMembers = (circleId) => {
    router.push(`/circle-management/members?circleId=${circleId}`);
  };

  const handleEditInfo = (circleId) => {
    router.push(`/circle-update/${circleId}`);
  };

  const handleCreateCircle = () => {
    router.push(`/circle-update/0`);
  };

  return (
    <div className="px-2">
      <h1 className="text-2xl font-bold text-gray-500 mb-2 px-2">동아리 관리</h1>

      {/* 내가 가입한 동아리 */}
      <section className="mb-6 flex-1 overflow-y-auto p-2">
        <h2 className="text-lg font-semibold text-gray-500 mb-4">
          내가 가입한 동아리
        </h2>
        <div className="space-y-4">
          {!joinedCircles || joinedCircles.length === 0 ? (
            <div className="bg-gray-100 p-4 space-y-4 rounded-lg">
            <p className="text-gray-500">아직 가입한 동아리가 없습니다.</p>
            </div>
          ) : (
            joinedCircles.map((circle, index) => (
              <CirclePreview 
              key={index} 
              circle={circle} 
              onClick={() => {router.push(`circle-detail/${circle.id}`)}}/>
            ))
          )}
        </div>
      </section>

      {/* 내가 관리중인 동아리 */}
      <section className="flex-1 overflow-y-auto p-2">
        <h2 className="text-lg font-semibold text-gray-500 mb-4">
          내가 관리중인 동아리
        </h2>
        <div className="space-y-4">
          {!managedCircles || managedCircles.length === 0 ? (
            <div className="bg-gray-100 p-4 space-y-4 rounded-lg">
            <p className="text-gray-500">관리중인 동아리가 없습니다.</p>
            </div>
          ) : (
            managedCircles.map((circle, index) => (
              <CircleManagementPreview
                key={index}
                circle={circle}
                onManageMembers={() => handleManageMembers(circle.id)}
                onEditInfo={() => handleEditInfo(circle.id)}
              />
            ))
          )}
        </div>
      </section>

      {/* 동아리 개설 버튼 */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleCreateCircle}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 focus:outline-none"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M17.5,12C20.5376,12,23,14.4624,23,17.5C23,20.5376,20.5376,23,17.5,23C14.4624,23,12,20.5376,12,17.5C12,14.4624,14.4624,12,17.5,12ZM17.5,13.9992L17.4101,14.0073C17.206,14.0443,17.045099999999998,14.2053,17.0081,14.4094L17,14.4992L16.9996,16.999200000000002L14.4977,17L14.4078,17.0081C14.2037,17.045099999999998,14.0427,17.206,14.0057,17.4101L13.9977,17.5L14.0057,17.5899C14.0427,17.794,14.2037,17.954900000000002,14.4078,17.9919L14.4977,18L17.000700000000002,17.999200000000002L17.0011,20.5035L17.0092,20.5934C17.0462,20.7975,17.2071,20.9584,17.4112,20.9954L17.5011,21.0035L17.591,20.9954C17.795099999999998,20.9584,17.956,20.7975,17.9931,20.5934L18.0011,20.5035L18.0007,17.999200000000002L20.5046,18L20.5944,17.9919C20.7985,17.954900000000002,20.9595,17.794,20.9965,17.5899L21.0046,17.5L20.9965,17.4101C20.9595,17.206,20.7985,17.045099999999998,20.5944,17.0081L20.5046,17L17.9996,16.999200000000002L18,14.4992L17.9919,14.4094C17.954900000000002,14.2053,17.794,14.0443,17.5899,14.0073L17.5,13.9992ZM14.254,10C15.0886,10,15.817,10.4543,16.205399999999997,11.1292C13.2353,11.7297,11,14.3538,11,17.5C11,18.7892,11.3753,19.9907,12.0226,21.0012L12.003,21C9.51712,21,7.50193,18.9848,7.50193,16.499000000000002L7.50193,12.25C7.50193,11.0074,8.50929,10,9.75193,10L14.254,10ZM7.40645,10.0003C6.89291,10.535499999999999,6.56081,11.2462,6.50903,12.0335L6.50193,12.25L6.50193,16.499000000000002C6.50193,17.345599999999997,6.69319,18.1476,7.03487,18.864C6.70577,18.953,6.35899,19,6.00124,19C3.79142,19,2,17.2086,2,14.9988L2,12.25C2,11.0591,2.92516,10.084399999999999,4.09595,10.0052L4.25,10L7.40645,10.0003ZM19.75,10C20.9926,10,22,11.0074,22,12.25L22.0008,12.8104C20.8328,11.6891,19.2469,11,17.5,11L17.2568,11.0045C17.101300000000002,10.6296,16.8769,10.2894,16.5995,10.0003L19.75,10ZM18.5,4C19.8807,4,21,5.1192899999999995,21,6.5C21,7.88071,19.8807,9,18.5,9C17.119300000000003,9,16,7.88071,16,6.5C16,5.1192899999999995,17.119300000000003,4,18.5,4ZM12,3C13.6569,3,15,4.34315,15,6C15,7.65685,13.6569,9,12,9C10.3431,9,9,7.65685,9,6C9,4.34315,10.3431,3,12,3ZM5.5,4C6.88071,4,8,5.1192899999999995,8,6.5C8,7.88071,6.88071,9,5.5,9C4.1192899999999995,9,3,7.88071,3,6.5C3,5.1192899999999995,4.1192899999999995,4,5.5,4Z"
              fill="#FFFFFF"
              fillOpacity="1"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CircleManagementPage;

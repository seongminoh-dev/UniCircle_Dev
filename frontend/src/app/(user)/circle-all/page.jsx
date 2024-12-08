"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import CirclePreview from "@/components/CirclePreview";
import { getCircles } from "@/services";

const CircleListPage = () => {
  const router = useRouter();
  const auth = useAuth();
  
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
      return;
    }

    const fetchData = async () => {
      try {
        const allCircles = await getCircles();
        const structuredCircles = allCircles.map(circle => ({
            id: circle.circleId,
            name: circle.name,
            image: circle.imageUrl || "https://via.placeholder.com/150",
            tags: circle.hashtags || [],
            description: circle.description,
          }));
        setCircles(structuredCircles);
      } catch (error) {
        console.error(error);
        alert("데이터 로딩에 실패했습니다.");
      }
    };

    fetchData();
  }, [auth,router]);

  return (
    <div className="space-y-4 px-2">
      <h2 className="text-2xl font-semibold text-gray-500 px-2 mb-2">동아리 탐색</h2>

      <div className="space-y-2 px-2">
          {!circles || circles.length === 0 ? (
            <div className="bg-gray-100 p-4 space-y-4 rounded-lg">
            <p className="text-gray-500">아직 동아리가 없습니다.</p>
            </div>
          ) : (
            circles.map((circle, index) => (
              <CirclePreview key={index} circle={circle} />
            ))
          )}
        </div>
    </div>
  );
};

export default CircleListPage;

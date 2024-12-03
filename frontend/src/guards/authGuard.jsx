"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";

export const AuthGuard = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [showError, setShowError] = useState(false); // 오류 메시지 표시 여부

  useEffect(() => {
    if (!router || isLoading) return;

    if (!isAuthenticated) {
      setShowError(true); // 오류 메시지 표시
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return null; // 로딩 중에는 아무것도 표시하지 않음
  }

  if (showError) {
    // 로그인 필요 오류 메시지 및 버튼 표시
    return (
      <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <div className="mb-4 py-2 px-4 bg-red-100 text-red-700 rounded-md border border-red-400">
          <p className="text-sm">해당 기능을 이용하려면 로그인 해야 합니다.</p>
        </div>
        <button
          onClick={() => router.replace("/auth/login")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          로그인 화면으로 이동
        </button>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};


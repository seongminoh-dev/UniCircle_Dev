"use client";

import styles from "@/styles/login.module.scss";
import { Loading, Header, LoginForm } from "@/components";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // 이미 로그인 된 상태라면 /board로 리다이렉트
  useEffect(() => {
    const isUserValid = async () => {
      if (isAuthLoading) return;
      if (isAuthenticated) {
        router.push("/boards/related");
      } else {
        setIsLoading(false);
      }
    };
    isUserValid();
  }, [isAuthLoading,isAuthenticated,router]);

  return isLoading ? (
    <div className={styles.frame} style={{ width: "100vw" }}>
      <Loading />
    </div>
  ) :(
    <div className="min-h-screen flex flex-col">
      {/* 상단에 고정된 헤더 */}
      <Header />
      {/* 중앙에 배치된 로그인 폼 */}
      <div className="flex-grow flex items-start justify-center mt-16">
        <LoginForm />
      </div>
    </div>
  )
};

export default LoginPage;

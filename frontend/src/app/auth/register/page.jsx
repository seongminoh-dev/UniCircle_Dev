"use client";

import styles from "@/styles/login.module.scss";
import { Loading, Header, RegisterForm } from "@/components";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";

const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
    const router = useRouter();
   
    // 이미 로그인 된 상태라면 /board로 리다이렉트
    useEffect(() => {
      const isUserValid = async () => {
        if (isAuthLoading) return;
        if (isAuthenticated) {
          router.push("/board");
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
  ) : (
    <div className="min-h-screen flex flex-col">
      {/* 상단 헤더 */}
      <Header />
      {/* 회원가입 폼 */}
      <div className="flex-grow flex items-start justify-center mt-16">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
"use client";
import styles from "@/styles/login.module.scss";
import { Header, RegisterForm } from "@/components";
import { useEffect, useState } from "react";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 로딩 상태 설정
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <div className={styles.frame} style={{ width: "100vw" }}>
      <p>로딩 중...</p>
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


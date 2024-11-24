"use client";
import styles from "@/styles/login.module.scss";
import { Header, ResetPasswordForm } from "@/components";
import { useState } from "react";

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 헤더 */}
      <Header />
      {/* 비밀번호 재설정 폼 */}
      <div className="flex-grow flex items-start justify-center mt-16">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;

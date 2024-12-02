"use client";

import { Header } from "@/components";
import { ChangePasswordForm } from "@/components/ChangePasswordForm"
import { AuthGuard } from "@/guards/authGuard";

const ChangePasswordPage = () => {
 return(
  
    <div className="min-h-screen flex flex-col">
      {/* 상단 헤더 */}
      <Header />
      {/* 비밀번호 변경 폼 */}
      <AuthGuard>
      <div className="flex-grow flex items-start justify-center mt-16">
        <ChangePasswordForm />
      </div>
      </AuthGuard>
    </div>
   
  );
};

export default ChangePasswordPage;
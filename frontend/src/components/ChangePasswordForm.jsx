'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Login, changePassword } from "@/services/Auth"; // 서비스 모듈에서 비밀번호 변경 함수 가져오기
import { useAuth } from "@/hooks";

export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // 비밀번호 변경 상태 관리
  const { user } = useAuth();
  const router = useRouter();
  const userAuth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 비밀번호 일치 확인
    if (newPassword !== confirmPassword) {
      setErrorMessage("새 비밀번호가 일치하지 않습니다.");
      setSuccessMessage("");
      return;
    }
    // 현재 비밀번호 확인
    try {
      await Login({ email: user.userId, password: currentPassword });
    } catch (error) {
      setErrorMessage("현재 비밀번호가 올바르지 않습니다.");
      setSuccessMessage("");
      return;
    }
    // 신규 비밀번호 변경
    try {
      const username = "익명";
      await changePassword({ username, email: user.userId, newPassword });
      setSuccessMessage("비밀번호가 성공적으로 변경되었습니다! 다시 로그인 해주세요.");
      setErrorMessage("");
      setIsSubmitted(true); // 변경 완료 상태로 전환
      setTimeout(() => {
        userAuth.signOut();
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      setErrorMessage("알 수 없는 오류로 비밀번호 변경에 실패했습니다.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">비밀번호 변경</h2>
      {errorMessage && (
        <div className="mb-4 py-2 px-4 bg-red-100 text-red-700 rounded-md border border-red-400">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 py-2 px-4 bg-green-100 text-green-700 rounded-md border border-green-400">
          <p className="text-sm">{successMessage}</p>
        </div>
      )}
      {!isSubmitted && ( // 비밀번호 변경 완료 상태가 아닐 때만 폼 표시
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-bold mb-2">
              현재 비밀번호
            </label>
            <input
              id="currentPassword"
              type="password"
              placeholder="현재 비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
              새 비밀번호
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            비밀번호 변경
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordForm;


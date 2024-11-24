"use client";
import { useState } from "react";

export const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증번호 확인 및 비밀번호 재설정
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    // 이메일 인증 요청 API 호출
    console.log("이메일 인증 요청:", email);
    setStep(2); // 인증 단계로 전환
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    // 비밀번호 재설정 API 호출
    console.log("비밀번호 재설정:", { verificationCode, newPassword });
    setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <h2 className="text-2xl font-semibold mb-6 text-center">비밀번호 찾기</h2>
          {/* 이메일 입력 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          {/* 이메일 전송 버튼 */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              인증 이메일 보내기
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePasswordReset}>
          <h2 className="text-2xl font-semibold mb-6 text-center">비밀번호 재설정</h2>
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          {/* 인증번호 입력 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="verificationCode">
              인증번호
            </label>
            <input
              id="verificationCode"
              type="text"
              placeholder="인증번호"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* 새 비밀번호 입력 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
              새 비밀번호
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* 비밀번호 재설정 버튼 */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              비밀번호 재설정
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordForm;

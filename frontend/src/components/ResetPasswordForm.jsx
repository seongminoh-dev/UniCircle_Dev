"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification, resetPassword } from "@/services/ResetPassword";

export const ResetPasswordForm = () => {
    // 이메일 인증
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [resendTimer, setResendTimer] = useState(0); // 재전송 제한 타이머
    // 비밀번호
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // UI 렌더링
    const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증번호 확인 및 비밀번호 재설정
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [redirecting, setRedirecting] = useState(false); // 리디렉션 상태 관리
    const router = useRouter();

    // 이메일 전송
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendEmailVerification(email);
            setStep(2); // UI 변경
            handleResendEmail(); // 인증번호 초기 전송
            setSuccessMessage("인증번호가 이메일로 전송되었습니다.");
            setErrorMessage("");
            } catch (error) {
            setErrorMessage("가입되지 않은 이메일 입니다.");
            setSuccessMessage("");
        }
    };
    
    // 이메일 재전송
    const handleResendEmail = async () => {
        if (resendTimer > 0) return;
        try {
            await sendEmailVerification(email);
            setResendTimer(60);
            setSuccessMessage("인증번호가 이메일로 전송되었습니다.");
            setErrorMessage("");
            const interval = setInterval(() => {
                setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
              });
            }, 1000);
          } catch (error) {
            setErrorMessage("인증번호 재전송 중 오류가 발생했습니다.");
            setSuccessMessage("");
        }
    };

    // 비밀번호 변경
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            setSuccessMessage("");
        return;
        } 
        try {
            await resetPassword(verificationCode, newPassword);
            setErrorMessage("");
            setSuccessMessage("비밀번호가 성공적으로 변경되었습니다!");
            setRedirecting(true);
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        } catch (error) {
            setErrorMessage("인증번호가 올바르지 않습니다.");
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        {/* 메일 전송 전 UI */}
        {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
            <h2 className="text-2xl font-semibold mb-6 text-center">비밀번호 찾기</h2>
            {/* Error 메시지 */}
            {errorMessage && (
                <div className="mb-4 py-2 px-4 bg-red-100 text-red-700 rounded-md border border-red-400">
                <p className="text-sm">{errorMessage}</p>
            </div>
            )}
            {/* Success 메시지 */}
            {successMessage && (
                <div className="mb-4 py-2 px-4 bg-green-100 text-green-700 rounded-md border border-green-400">
                <p className="text-sm">{successMessage}</p>
                </div>
            )}
            {/* 이메일 입력 */}
            <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
            >
            이메일
            </label>
            <input
                id="email"
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        
        {/* 메일 전송 후 UI */} 
        {step === 2 && (
        <form onSubmit={handlePasswordReset}>
            <h2 className="text-2xl font-semibold mb-6 text-center">비밀번호 재설정</h2>
            {/* Error 메시지 */}
            {errorMessage && (
                <div className="mb-4 py-2 px-4 bg-red-100 text-red-700 rounded-md border border-red-400">
                <p className="text-sm">{errorMessage}</p>
            </div>
            )}
            {/* Success 메시지 */}
            {successMessage && (
                <div className="mb-4 py-2 px-4 bg-green-100 text-green-700 rounded-md border border-green-400">
                <p className="text-sm">{successMessage}</p>
                </div>
            )}
            {!redirecting && (
            <>
            {/* 인증번호 입력 */}
            <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="verificationCode"
            >
            인증번호
            </label>
            <input
                id="verificationCode"
                type="text"
                placeholder="인증번호"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
            </div>

            {/* 이메일 재전송 안내 */}
            <div className="mb-4">
                <p className="text-sm text-blue-600 cursor-pointer hover:underline" onClick={handleResendEmail}>
                이메일을 받지 못하셨나요?
                </p>
                {resendTimer > 0 && (
                  <p className="text-gray-600 text-sm mt-1">
                    인증번호 발송 완료. {resendTimer}초 후에 다시 시도해주세요.
                  </p>
                )}
            </div>

            {/* 새 비밀번호 입력 */}
            <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="newPassword"
            >
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

            {/* 새 비밀번호 확인 */}
            <div className="mb-4">
            <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
            >
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

            {/* 비밀번호 재설정 버튼 */}
            <div>
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
            비밀번호 재설정
            </button>
            </div>
            </>
            )}
        </form>
        )}
        </div>
    );
};

export default ResetPasswordForm;
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/Register";
import { sendEmailVerification, verifyEmailCode } from "@/services/VerifyEmail" 

export const RegisterForm = () => {
    // 회원가입 정보
    const [email, setEmail] = useState("");
    const [emailCode, setEmailCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    //이메일 인증
    const [isEmailSent, setIsEmailSent] = useState(false); //이메일 전송 여부
    const [isEmailVerified, setIsEmailVerified] = useState(false); //이메일 인증 여부
    const [resendTimer, setResendTimer] = useState(0); //이메일 재전송 타이머
    const RESENT_TIME=60;
    //기타
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [redirecting, setRedirecting] = useState(false);
    const router = useRouter();

    // 인증 이메일 발송
    const handleSendEmail = async () => {
        // 이메일 입력 여부 검사
        if (!email) {
            setErrorMessage("이메일을 입력하세요.");
            setSuccessMessage("");
            return;
        }
        // 유효 이메일 여부 검사
        if (!email.includes("@")) {
            setErrorMessage("유효한 이메일 주소를 입력하세요.");
            setSuccessMessage("");
            return;
        }
        // 인증메일 전송
        try {
            await sendEmailVerification(email);
            setIsEmailSent(true);
            setResendTimer(RESENT_TIME);
            setErrorMessage("");
            setSuccessMessage("이메일 전송 성공. 인증번호를 입력하세요");
            // 재전송 타이머
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
            setErrorMessage("이메일 전송 오류, 잠시후 다시 시도해주세요");
            setSuccessMessage("");
        }
    };

    // 인증번호 인증
    const handleVerifyEmailCode = async () => {
        try {
            await verifyEmailCode(email, emailCode);
            setIsEmailVerified(true);
            setErrorMessage("");
            setSuccessMessage("");
        } catch (error) {
            setErrorMessage("인증번호가 잘못되었습니다.");
            setSuccessMessage("");
        }
    };

    // 회원가입 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        // 이메일 인증 여부 검사
        if (!isEmailVerified) {
            setErrorMessage("이메일 인증을 완료하세요.");
            setSuccessMessage("");
        return;
        }
        // 비밀번호 일치 여부 검사
        if (password !== confirmPassword) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            setSuccessMessage("");
        return;
        }
        // 회원가입
        try {
            await registerUser({ email, password });
            setErrorMessage("");
            setSuccessMessage("회원가입이 완료되었습니다! 로그인 화면으로 이동합니다.");
            // 회원가입 성공시 3초후 로그인 페이지로 이동
            setRedirecting(true);
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        } catch (error) {
            setErrorMessage("회원가입 중 오류가 발생했습니다. 잠시후 다시 시도하세요");
            setSuccessMessage("");
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">회원가입</h2>

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
            <form onSubmit={handleSubmit}>
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
                    className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    disabled={isEmailVerified} // 이메일 인증 완료 시 입력 불가능
                />
                </div>

                {/* 이메일 인증번호 입력 */}
                {isEmailSent && !isEmailVerified && (
                <>
                <div className="mb-4">
                <label
                  htmlFor="emailCode"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                이메일 인증번호
                </label>
                <input
                    type="text"
                    id="emailCode"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    placeholder="인증번호 입력"
                    className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
                </div>
                <div className="mb-4 flex items-center">
                <button
                    type="button"
                    onClick={handleVerifyEmailCode}
                    className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
                >
                인증번호 인증
                </button>
                </div>
                </>
                )}

                {/* 이메일 인증 완료 메시지 */}
                {isEmailVerified && (
                <p className="text-green-500 text-sm mb-4">이메일이 인증되었습니다.</p>
                )}

                {/* 이메일 전송 버튼 */}
                {!isEmailVerified && (
                <div className="mb-4 flex items-center">
                <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={resendTimer > 0}
                    className={`px-4 py-2 rounded text-white ${
                    resendTimer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                {resendTimer > 0 ? `${resendTimer}초 후 재전송` : "인증 이메일 보내기"}
                </button>
                </div>
                )}

                {/* 비밀번호 입력 */}
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                비밀번호
                </label>
                <input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
                </div>

                {/* 비밀번호 확인 */}
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
                    className="shadow appearance-none border rounded w-full px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
                </div>

                {/* 회원가입 버튼 */}
                <div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                회원가입
                </button>
                </div>
            </form>
            )}
        </div>
    );
};

export default RegisterForm;
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/services/Auth";

export const ResetPasswordForm = () => {
  // 이메일 정보
  const [email, setEmail] = useState("");
  // 상태 관리
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true); // 전송 중 상태 활성화
    setErrorMessage("");
    try {
      // 임시 비밀번호 전송 요청
      const userName = "익명"; // 기본 이름
      await resetPassword({ userName, email });
      setSuccessMessage("임시 비밀번호가 이메일로 전송되었습니다. 다시 로그인 해주세요.");
      setErrorMessage("");
      setTimeout(() => {
        router.push("/");
      }, 4000);
    } catch (error) {
      setErrorMessage("가입되지 않은 이메일입니다.");
      setSuccessMessage("");
    } finally {
      setIsSending(false); // 전송 상태 비활성화
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">비밀번호 재설정</h2>
      {/* 오류 메시지 */}
      {errorMessage && (
        <div className="mb-4 py-2 px-4 bg-red-100 text-red-700 rounded-md border border-red-400">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
      {/* 성공 메시지 */}
      {successMessage && (
        <div className="mb-4 py-2 px-4 bg-green-100 text-green-700 rounded-md border border-green-400">
          <p className="text-sm">{successMessage}</p>
        </div>
      )}
      {/* 이메일 입력 및 버튼 */}
      {!successMessage && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
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
              disabled={isSending} // 전송 중일 때 비활성화
            />
          </div>
          <button
            type="submit"
            className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isSending
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isSending} // 전송 중일 때 비활성화
          >
            {isSending ? "전송 중..." : "임시 비밀번호 전송"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordForm;


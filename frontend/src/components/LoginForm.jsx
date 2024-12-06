'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isAuthenticated,signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 로그인 로직
    try {
      await signIn({ email, password });
      router.push("/");
    } catch (error) {
      setErrorMessage("아이디/비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">로그인</h2>

      {/* 에러 메시지 표시 */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-400">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* 이메일 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            이메일
          </label>
          <div className="relative flex items-center">
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
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            패스워드
        </label>
        <div className="relative flex items-center">
        <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="패스워드"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  // pr-10로 오른쪽 패딩 추가
            required
        />
        {/* Eye icon button to toggle password visibility */}
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
             className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
        >
            <svg 
            width="20" 
            height="20"
             viewBox="0 0 20 20" 
             fill="none" 
             xmlns="http://www.w3.org/2000/svg"
             >
            {showPassword ? (
                <path d="M3.25909 11.6021C3.94254 8.32689 6.79437 6 10 6C13.2057 6 16.0574 8.32688 16.7409 11.6021C16.7974 11.8725 17.0622 12.0459 17.3325 11.9895C17.6029 11.933 17.7763 11.6682 17.7199 11.3979C16.9425 7.67312 13.6934 5 10 5C6.3066 5 3.05742 7.67311 2.28017 11.3979C2.22377 11.6682 2.39718 11.933 2.6675 11.9895C2.93782 12.0459 3.20268 11.8725 3.25909 11.6021ZM9.98953 8C11.9225 8 13.4895 9.567 13.4895 11.5C13.4895 13.433 11.9225 15 9.98953 15C8.05653 15 6.48953 13.433 6.48953 11.5C6.48953 9.567 8.05653 8 9.98953 8Z" fill="#14142B"/>
                
            ) : (
                <path d="M2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L5.64526 6.35237C3.97039 7.49178 2.72334 9.27383 2.28011 11.3979C2.22371 11.6682 2.39712 11.9331 2.66744 11.9895C2.93776 12.0459 3.20262 11.8725 3.25903 11.6021C3.66284 9.66698 4.82362 8.06289 6.3671 7.07421L7.94894 8.65604C7.06509 9.29133 6.48947 10.3284 6.48947 11.5C6.48947 13.433 8.05647 15 9.98947 15C11.161 15 12.1981 14.4244 12.8334 13.5405L17.1464 17.8536C17.3417 18.0488 17.6583 18.0488 17.8536 17.8536C18.0488 17.6583 18.0488 17.3417 17.8536 17.1464L2.85355 2.14645ZM10.1238 8.00253L13.4869 11.3657C13.418 9.5395 11.95 8.07143 10.1238 8.00253ZM7.53104 5.4098L8.3341 6.21286C8.87141 6.07353 9.43009 6 9.99995 6C13.2056 6 16.0574 8.32688 16.7409 11.6021C16.7973 11.8725 17.0622 12.0459 17.3325 11.9895C17.6028 11.933 17.7762 11.6682 17.7198 11.3979C16.9425 7.67312 13.6934 5 9.99995 5C9.14478 5 8.31342 5.14331 7.53104 5.4098Z" fill="#14142B"/>
            )}
            </svg>
        </button>
        </div>
        </div>


        {/* 로그인 정보 저장 */}
        <div className="mb-6">
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
            <span className="ml-2 text-gray-700 text-sm">로그인 정보 저장</span>
          </label>
        </div>

        {/* 비밀번호 잊었나요 링크 */}
        <div className="flex items-center justify-between mb-4">
            <Link href="/auth/reset-password" className="text-blue-600 hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
        </div>

        {/* 로그인 버튼 */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            로그인
          </button>
        </div>

        {/* 회원가입 링크 */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
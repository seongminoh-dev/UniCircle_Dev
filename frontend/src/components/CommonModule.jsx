'use client';
import { useState } from 'react';

export const CommonModule = ({ small = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password });
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">로그인</h2>

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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            패스워드
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="패스워드"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {/* Eye icon button to toggle password visibility */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {showPassword ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825C12.894 19.44 11.68 20 10 20 5.522 20 1.732 17.057.458 12c.274-1.084.693-2.072 1.236-2.938m1.39-1.445C3.37 7.322 4.692 6 6.58 5.235M8.123 3.573C8.935 3.203 9.793 3 10 3c4.478 0 8.268 2.943 9.542 7-.274 1.084-.693 2.072-1.236 2.938M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.274 1.084-.693 2.072-1.236 2.938M1 1l22 22"
                />
              )}
            </svg>
          </button>
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
          <a href="#" className="text-blue-600 text-sm hover:underline">
            비밀번호를 잊으셨나요?
          </a>
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
            <a href="#" className="text-blue-600 hover:underline">
              회원가입
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default CommonModule;
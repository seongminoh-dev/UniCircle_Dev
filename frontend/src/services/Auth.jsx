"use server";
import { deleteCookies } from "./Cookie";

// 로그인 API 서버 통신 함수
export async function Login({email, password}) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  try {
    // 서버 로그인 요청
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        accept: "*/*",
      },
    });
    const rawResponse = await response.text();
    // 로그인 성공, 실패
    const result = parseTokens(rawResponse);
    if (response.status === 200 && result.accessToken && result.refreshToken) {
      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
    } else {
      throw new Error(`Invalid Email or Password: ${response.status}`);
    }
  } catch (error) {
    console.error("Unknown Error:", error.message);
    throw error;
  }
}

// 로그아웃 함수
export async function Logout() {
  deleteCookies("refresh_token");
  deleteCookies("access_token");
  return ;
}

// 회원가입 API 서버 통신 함수
export async function registerUser({ email, password }) {
  const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;
  const name = `익명${generateRandomNumber()}`;
  const nickname = name;
  const URL = `${process.env.NEXT_PUBLIC_API_URL}auth/register`;
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, nickname, email, password }),
    });
    const result = await response.text();
    if (response.status === 200) {
      return result;
    } else {
      throw new Error(`Register Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Unknown Register Error:", error.message);
    throw error;
  }
}

// 비밀번호 초기화 API 서버 통신 함수
export async function resetPassword({ token, password }) {
  // const URL = `${process.env.NEXT_PUBLIC_API_URL}/register/`;

  // const response = await fetch(URL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ email, password }),
  // });

  const res = {status: 200, json: () => {return {access: "access", token: {access: null, refresh: null}}}};
  if (res.status == 200) return res.json();
  if (res.status == 205) return res.json();
      throw new Error(`Reset Password Error:${res.status}`);
}

// 서버 인증 이메일 발송 요청 함수
export async function sendEmailVerification(email) {
  // 이메일 발송 요청 작성 부분
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/sendEmail/`;
  // const res = await fetch(URL, {
  //   method: "POST",
  //   headers: new Headers({
  //     accept: "*/*",
  //     "Content-Type": "application/json",
  //   }),
  //   body: JSON.stringify({
  //     email: email,
  //   }),
  //   cache: "no-store",
  // });
  const res = {status: 200, json: () => {return {access: "access", token: {access: null, refresh: null}}}};
  if (res.status == 200) return res.json();
  if (res.status == 205) return res.json();
  throw new Error(`Send Email Error:${res.status}`);

}

// 서버 인증 이메일 발송 검증 함수
export async function verifyEmailCode(email, code) {
  // 인증번호 검증 UI
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/verify-email-code/`;
  // const response = await fetch(URL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ email, code }),
  // });
  const res = {status: 200, json: () => {return {access: "access", token: {access: null, refresh: null}}}};
  if (res.status == 200) return res.json();
  if (res.status == 205) return res.json();
      throw new Error(`Verify Email Error:${res.status}`);
}

// 서버 응답 파싱 함수 For 로그인
function parseTokens(responseText) {
  const lines = responseText.split('\n');
  let accessToken = '';
  let refreshToken = '';
  lines.forEach((line) => {
    if (line.startsWith('AccessToken:')) {
      accessToken = line.replace('AccessToken: Bearer ', '').trim();
    } else if (line.startsWith('RefreshToken: ')) {
      refreshToken = line.replace('RefreshToken: Bearer ', '').trim();
    }
  });
  return {
    accessToken,
    refreshToken,
  };
}



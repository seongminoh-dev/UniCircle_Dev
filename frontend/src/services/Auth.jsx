"use server";

// Import Module
import { setCookie, deleteCookies } from "./Cookie";

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
    const loginResponse = await response.json();
    // 로그인 성공, 실패
    if (response.status === 200 && loginResponse.accessToken && loginResponse.refreshToken) {
      setCookie("access_token", loginResponse.accessToken, { maxAge: 1800 }); // 30분 유효
      setCookie("refresh_token", loginResponse.refreshToken, { maxAge: 86400 }); // 24시간 유효
      delete loginResponse.accessToken;
      delete loginResponse.refreshToken;
      setCookie("user", JSON.stringify(loginResponse), { maxAge: 86400 }); // 24시간 유효
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Unknown Error:", error.message);
    throw error;
  }
}

// 로그아웃 함수
export async function Logout() {
  deleteCookies("access_token");
  deleteCookies("refresh_token");
  deleteCookies("user");
  return ;
}

// 회원가입 API 서버 통신 함수
export async function registerUser({ name, nickname, email, password }) {
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
export async function resetPassword({ userName, email }) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}auth/reset-password?username=${encodeURIComponent(userName)}&email=${encodeURIComponent(email)}`;
  try {
    // 서버 로그인 요청
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        accept: "*/*",
      },
    });
    if (response.status === 200) {
      return ;
    } else {
      throw new Error(`Invalid Email or Username: ${response.status}`);
    }
  } catch (error) {
    console.error("Unknown Error:", error.message);
    throw error;
  }
}

// 비밀번호 변경 API 서버 통신 함수
export async function changePassword({ username, email, newPassword }) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}auth/change-password?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}&newPassword=${encodeURIComponent(newPassword)}`;
  console.log(URL);
  try {
    // 서버 로그인 요청
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        accept: "*/*",
      },
    });
    const rawResponse = await response.text();
    if (response.status === 200) {
      return;
    } else {
      throw new Error(`Invalid Email or Password: ${response.status}`);
    }
  } catch (error) {
    console.error("Unknown Error:", error.message);
    throw error;
  }
}

// 서버 인증 이메일 발송 요청 함수
export async function sendEmailVerification(email) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}auth/send-verification-code?email=${encodeURIComponent(email)}`;
  try {
    // 서버 인증 메일 발송 요청
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        accept: "*/*",
      },
    });
    const rawResponse = await response.text();
    // 이메일 전송 성공, 실패
    if (response.status === 200) {
      return;
    } else {
      throw new Error(`Invalid Email in Email Verification: ${response.status}`);
    }
  } catch (error) {
    console.error("Unknown Error:", error.message);
    throw error;
  }
}

// 서버 인증 이메일 발송 검증 함수
export async function verifyEmailCode(email, code) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}auth/verify-code?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`;
  try {
    // 서버 인증 요청
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        accept: "*/*",
      },
    });
    const rawResponse = await response.text();
    // 인증 성공 실패
    if (response.status === 200) {
      return;
    } else {
      throw new Error(`Invalid Verification Code: ${response.status}`);
    }
  } catch (error) {
    console.error("Unknown Error:", error.message);
    throw error;
  }
}




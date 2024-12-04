// 토큰 관련 서비스 모듈입니다 checkToken()을 통해 자동화된 토큰 갱신 수행 가능
"use server";

import { getCookie, setCookie } from "./Cookie";
import { jwtDecode } from "jwt-decode";

// 서버에서 토큰 유효성 검사 <-- API 나오면 수정해야 함
const isValidToken = async (token) => {
  if (!token) return false;
  return true;
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/verify-token`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token }),
//     });
//     return response.status === 200; 
//   } catch (error) {
//     console.error("토큰 유효성 검사 실패:", error);
//     return false;
//   }
};

// Refresh 토큰으로 새로운 Access 토큰 요청 <-- 나중에 구현
const tokenRefresh = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token이 없습니다.");
  return true;
  //   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/refresh`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token }),
//     });
//     return response.status === 200; 
//   } catch (error) {
//     console.error("토큰 유효성 검사 실패:", error);
//     return false;
//   }
};

// 통합 토큰 검사 및 갱신 로직 null 반환시 유효한 토큰 없음
export const getAccessToken = async () => {
  try {
    // 쿠키에서 Access Token을 가져옴
    const accessToken = await getCookie("access_token");

    // Access Token 없으면 null 반환
    if (!accessToken) return null;

    // access_token이 유효한 경우 true 반환
    if (accessToken && (await isValidToken(accessToken))) {
      return accessToken;
    }

    // access_token이 유효하지 않고 refresh_token이 유효한 경우 갱신후 true 반환
    const refreshToken = await getCookie("refresh_token");
    if (refreshToken && (await isValidToken(refreshToken))) {
      await tokenRefresh(refreshToken);
      const accessToken = await getCookie("access_token");
      return accessToken;
    }

    // 두 토큰 모두 유효하지 않은 경우 false 반환
    return null;
  } catch (error) {
    console.error("checkToken Error", error);
    return null;
  }
};

// JWT 토큰 해독
export const decodeToken = async () => {
  try {
    const accessToken = await getCookie('access_token');
    const decoded = jwtDecode(accessToken);
    console.log("Decoded Token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  };
}

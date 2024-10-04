"use server";
import { setCookie, deleteCookies, getCookie, PostData } from ".";

export async function Login({
  login_id,
  password,
})  {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}manager/login/`;
  // const res = await fetch(URL, {
  //   method: "POST",
  //   headers: new Headers({
  //     accept: "*/*",
  //     "Content-Type": "application/json",
  //   }),
  //   body: JSON.stringify({
  //     login_id: login_id,
  //     password: password,
  //   }),
  //   cache: "no-store",
  // });
  const res = {status: 200, json: () => {return {access: "access", token: {access: "access", refresh: "refresh"}}}};
  if (res.status == 200) return res.json();
  if (res.status == 205) return res.json();
  throw new Error(`Login Error:${res.status}`);
}

export async function isValidToken(
  token
){
  const accessToken = await getCookie("access_token");
  let result = true;

  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}${"manager/verify/"}`,
  //   {
  //     method: "POST",
  //     headers: new Headers({
  //       AUTHORIZATION: `Bearer ${accessToken}`,
  //       "Content-Type": "application/json",
  //     }),
  //     body: JSON.stringify({ token }),
  //     cache: "no-store",
  //   }
  // ).then((res) => {
  //   if (res.status === 200) result = true;
  // });
  return result;
}

export const tokenRefresh = async (
  refreshToken)=> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${"manager/refresh_token/"}`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ refresh: refreshToken }),
      cache: "no-store",
    }
  );
  if (response.status === 200) {
    // 새로운 access 토큰을 쿠키에 저장
    return response.json();
  }
  throw new Error(`Login Error:${response.status}`);
};

// 토큰이 valid한지 확인하고, 만료된 경우 갱신하고 true를 반환하는 함수. false 반환시 밖에서 logOut 처리해줘야합니다.
export const checkUserAuthentication = async () => {
  // 쿠키에서 토큰 가져오기
  return true;
  const refreshToken = await getCookie("refresh_token");
  const accessToken = await getCookie("access_token");

  if (!refreshToken && !accessToken) return false;
  //두 토큰이 valid한지 확인하는 함수
  const refreshValid = await isValidToken(refreshToken);
  const accessValid = await isValidToken(accessToken);
  // case1 : access token과 refresh token 모두가 유효한 경우 → 정상 처리
  if (refreshValid && accessValid) {
    return true;
  }
  // case4 : access token과 refresh token 모두가 만료된 경우 → 에러 발생 (재 로그인하여 둘다 새로 발급)
  else if (!refreshValid && !accessValid) return false;
  // case2 : access token은 만료됐지만, refresh token은 유효한 경우 →  refresh token을 검증하여 access token 재발급
  // case3 : access token은 유효하지만, refresh token은 만료된 경우 →  access token을 검증하여 refresh token 재발급
  //둘이 합쳐져있는 이유 : 현재 라이브러리 설계상, accesstoken이 발급될때 refresh도 같이 재발급됨.
  else if (
    !accessValid
    // || !refreshValid
  ) {
    // 토큰 갱신 API 호출
    const res = await tokenRefresh(refreshToken);
    setCookie("access_token", res.access);
    // TODO 이 부분 작동 안함(API가 리프레시 토큰을 보내지 않음)
    // setCookie("refresh_token", response.refresh);
    return true;
  }
  return false;
};

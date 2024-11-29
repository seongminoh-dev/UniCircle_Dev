"use server";

export async function Login({
  email,
  password,
})  {
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
    console.error("로그인 오류:", error.message);
    throw error;
  }
}

function parseTokens(responseText) {
  // 응답 텍스트를 줄 단위로 나눔
  const lines = responseText.split('\n');
  let accessToken = '';
  let refreshToken = '';

  // 각 줄을 확인하며 AccessToken과 RefreshToken 추출
  lines.forEach((line) => {
    if (line.startsWith('AccessToken:')) {
      accessToken = line.replace('AccessToken: Bearer ', '').trim();
    } else if (line.startsWith('RefreshToken: ')) {
      refreshToken = line.replace('RefreshToken: Bearer ', '').trim();
    }
  });

  // 결과를 JSON 형식으로 반환
  return {
    accessToken,
    refreshToken,
  };
}



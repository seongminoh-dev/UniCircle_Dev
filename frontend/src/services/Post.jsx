"use server";
import { getCookie } from ".";

export async function getBoardsByCircle(circleId) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}boards/circle/${circleId}`;

  const accessToken = await getCookie("access_token"); // 토큰 가져오기
  const res = await fetch(URL, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
    cache: "no-store",
  });

  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error(`Create Circle Error: ${res.status}`);
  }
}
"use server";
import { getCookie } from ".";

export async function createCircle(circleData) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}create`;
  console.log("circleData",circleData)
  console.log("url", URL)
  const accessToken = await getCookie("access_token"); // 토큰 가져오기
  const res = await fetch(URL, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
    body: JSON.stringify(circleData),
    cache: "no-store",
  });

  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error(`Create Circle Error: ${res.status}`);
  }
}

export async function updateCircle(circleId, circleData) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${circleId}/update`;
  console.log("circleData",circleData)
  console.log("url", url)
  const accessToken = await getCookie("access_token"); // 토큰 가져오기
  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }),
    body: JSON.stringify(circleData),
    cache: "no-store",
  });

  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error(`Create Circle Error: ${res.status}`);
  }
}

export async function getCircleById(circleId) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}getcircle?circleId=${circleId}`;
  const accessToken = await getCookie("access_token");
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
    cache: "no-store",
  });
  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error(`Get Circle Error: ${res.status}`);
  }
}

export async function getEncounteredCircle(userEmail) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}${userEmail}/circles`;

  const accessToken = await getCookie("access_token");
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
    throw new Error(`Get Circle Error: ${res.status}`);
  }
}

export async function getCircleMembers(circleId) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${circleId}/users`;
  const accessToken = await getCookie("access_token");
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
    cache: "no-store",
  });
  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error(`Get Circle Members Error: ${res.status}`);
  }
}
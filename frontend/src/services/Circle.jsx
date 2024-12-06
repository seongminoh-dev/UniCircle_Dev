"use server";
import { getCookie } from ".";
import { getAccessToken } from "./Token";

export async function createCircle(circleData) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}create`;
  const accessToken = getAccessToken();

  const formData = new FormData();
  for (const key in circleData) {
    formData.append(key, circleData[key]);
  }

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: formData,
    cache: "no-store",
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Create Circle Error: ${res.status}`);
  }
}

export async function updateCircle(circleId, circleData) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${circleId}/update`;
  console.log("circleData", circleData);
  console.log("url", url);

  const accessToken = getAccessToken();

  const formData = new FormData();
  for (const key in circleData) {
    formData.append(key, circleData[key]);
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `${accessToken}`,
    },
    body: formData,
    cache: "no-store",
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Update Circle Error: ${res.status}`);
  }
}
export async function getCircleById(circleId) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}getcircle?circleId=${circleId}`;
  const accessToken = await getAccessToken();
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: `${accessToken}`,
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

  const accessToken = await getAccessToken();
  const res = await fetch(URL, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
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
  const accessToken = await getAccessToken();
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: `${accessToken}`,
    }),
    cache: "no-store",
  });
  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error(`Get Circle Members Error: ${res.status}`);
  }
}
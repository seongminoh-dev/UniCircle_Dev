"use server";

import { getAccessToken } from "./Token";

// 모든 게시글 가져오기
export const getAllPosts= async () => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}boards`;
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        "Authorization": accessToken,
      },
    });
    if (response.status === 200) {
      const result = await response.json();
      return result;
    } else {
      throw new Error(`Unknown Error:${response.status}`);
    }
  } catch (error) {
    console.error("Unknown Error in getAllPosts", error.message);
    throw error;
  }
};

// postId 게시글 가져오기
export const getPost= async (postId) => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}boards/${postId}`;
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        "Authorization": accessToken,
      },
    });
    if (response.status === 200) {
      const result = await response.json();
      return result;
    } else {
      throw new Error(`Unknown Error:${response.status}`);
    }
  } catch (error) {
    console.error("Unknown Error in getPost", error.message);
    throw error;
  }
};

export async function getPostsByCircle(circleId) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}boards/circle/${circleId}`;

  const accessToken = await getAccessToken(); // 토큰 가져오기
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
    throw new Error(`Create Circle Error: ${res.status}`);
  }
}
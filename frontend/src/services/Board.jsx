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

export async function createBoard(boardData) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}boards`;

  const formData = new FormData();
  formData.append("userId", boardData.userId);       
  formData.append("circleId", boardData.circleId);  
  formData.append("title", boardData.title);        
  formData.append("content", boardData.content);    
  formData.append("visibility", boardData.visibility); 
  formData.append("hashtagId", 1);
  formData.append("isNotice", false);

  const accessToken = getAccessToken();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Create Board Error: ${res.status} - ${await res.text()}`);
  }
  return res.json();
}

export async function getBoardsByCircle(circleId) {
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
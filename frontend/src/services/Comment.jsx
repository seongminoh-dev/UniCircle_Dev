"use server";

import { getAccessToken } from "./Token";

// 회원가입 API 서버 통신 함수
export async function writeComment({ postId, userId, visibility, content }) {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}comments`;
    const accessToken = await getAccessToken(); // 토큰 가져오기
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${accessToken}`,
        },
        body: JSON.stringify({ postId, userId, visibility, content }),
      });
      if (response.status === 200) {
        return ;
      } else {
        throw new Error(`writeComment Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Unknown writeCommentError:", error.message);
      throw error;
    }
  }

  // 모든 댓글 불러오기
  export async function getComment(postId) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}comments/post/${postId}`;
    const accessToken = await getAccessToken();
    const res = await fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: `${accessToken}`,
      }),
      cache: "no-store",
    });
    if (res.status === 200) {
      return await res.json();
    } else {
      throw new Error(`Get Comment Error: ${res.status}`);
    }
  }
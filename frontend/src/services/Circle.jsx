"use server";
import { getAccessToken } from "./Token";

export async function createCircle(circleData) {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}create`;
  const accessToken = getAccessToken();

  const formData = new FormData();
  formData.append('name', circleData.name);
  formData.append('description', circleData.description);
  formData.append('email', circleData.email);
  formData.append('hashtags', circleData.hashtags);
  formData.append('questions', circleData.questions);
  if (circleData.image instanceof File) {
    formData.append('file', circleData.image, circleData.image.name);
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
  console.log("AAAA")
  const url = `${process.env.NEXT_PUBLIC_API_URL}${circleId}/update`;
  const accessToken = getAccessToken();
  
  const formData = new FormData();
  formData.append('name', circleData.name);
  formData.append('description', circleData.description);
  formData.append('email', circleData.email);
  formData.append('hashtags', circleData.hashtags);
  formData.append('questions', circleData.questions);
  if (circleData.image instanceof File) {
    formData.append('file', circleData.image, circleData.image.name);
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
    const errorText = await res.text();
    throw new Error(`Update Circle Error: ${res.status} - ${errorText}`);
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

export const getCircles = async()=> {
  const url = "http://quant-helper.online:8080/getcircles";
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        "Authorization": accessToken,
      },
    });

    if (res.status === 200) {
      const result = await res.json();
      return result;
    } else {
      throw new Error(`Get Circles Error: ${res.status}`);
    }
  } catch (error) {
    console.error("Unknown Error in getCircles:", error.message);
    throw error;
  }
};

export async function removeUserFromCircle(circleId, userEmail) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${circleId}/remove?userEmail=${encodeURIComponent(userEmail)}`;
  const accessToken = await getAccessToken();

  const res = await fetch(url, {
    method: "DELETE",
    headers: new Headers({
      Authorization: `${accessToken}`,
      Accept: "*/*", // 'accept: */*' 헤더 추가
    }),
    cache: "no-store",
  });

  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Remove User From Circle Error: ${res.status}`);
  }
}


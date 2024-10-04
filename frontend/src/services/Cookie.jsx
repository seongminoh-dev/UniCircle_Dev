"use server";

import { cookies } from "next/headers";

export const setCookie = (name, value) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const krTimeDiff = 9 * 60 * 60 * 1000;

  cookies().set(name, value, {
    expires: Date.now() + oneDay + krTimeDiff,
    secure: true,
    httpOnly: true,
    path: "/"
    // domain: `${process.env.NEXT_PUBLIC_BE_URL}`,
  });
};

export const getCookie = async (name) => {
  if (cookies().has(name)) {
    return cookies().get(name)?.value;
  } else return undefined;
};

export const getAllCookies = () => {
  return cookies().getAll();
};

export const deleteCookies = (name) => {
  return cookies().delete(name);
};

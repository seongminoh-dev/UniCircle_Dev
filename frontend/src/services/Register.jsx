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
"use client";

import { setCookie, deleteCookies, getCookie, PostData } from ".";

export async function Logout() {
  const refreshToken = await getCookie("refresh_token");
  const accessToken = await getCookie("access_token");
  // const response = await PostData({
  //   headers: new Headers({
  //     AUTHORIZATION: `Bearer ${accessToken}`,
  //     "Content-Type": "application/json",
  //   }),
  //   body: JSON.stringify({ refresh_token: refreshToken }),
  //   query: "manager/logout/",
  // })
    // .then((res) => {
      deleteCookies("refresh_token");
      deleteCookies("access_token");
      // return res;
      return ;
    // })

    // .catch((err) => {
    //   console.error(err);
    // });
  // if (response?.status === 200 || response?.status === 205 || response?.ok) {
  //   return true;
  // }
  // return false;
}

"use server";

export async function registerUser({ email, password }) {
  // const URL = `${process.env.NEXT_PUBLIC_API_URL}/register/`;

  // const response = await fetch(URL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ email, password }),
  // });

  const res = {status: 200, json: () => {return {access: "access", token: {access: null, refresh: null}}}};
  if (res.status == 200) return res.json();
  if (res.status == 205) return res.json();
      throw new Error(`Register Error:${res.status}`);
}

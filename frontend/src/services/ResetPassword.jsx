"use server";
export async function sendEmailVerification(email) {
    // 이메일 발송 요청 작성 부분
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/sendEmail/`;
    // const res = await fetch(URL, {
    //   method: "POST",
    //   headers: new Headers({
    //     accept: "*/*",
    //     "Content-Type": "application/json",
    //   }),
    //   body: JSON.stringify({
    //     email: email,
    //   }),
    //   cache: "no-store",
    // });
    const res = {status: 200, json: () => {return {access: "access", token: {access: null, refresh: null}}}};
    if (res.status == 200) return res.json();
    if (res.status == 205) return res.json();
    throw new Error(`Send Email Error:${res.status}`);
  
  }

  export async function resetPassword({ token, password }) {
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
        throw new Error(`Reset Password Error:${res.status}`);
  }
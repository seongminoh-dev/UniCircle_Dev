export async function PostData({
    headers,
    body,
    query,
  }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${query}`, {
      method: "POST",
      headers: headers,
      body: body,
      cache: "no-store",
    });
    if (res.status == 200 || res.status == 205) return res;
    throw new Error(`Post Error:${res.status}`);
  }
  
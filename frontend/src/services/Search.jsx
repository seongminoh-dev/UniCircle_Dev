export const searchContent = async (query) => {
  const URL = `${process.env.NEXT_PUBLIC_API_URL}search?keyword=${encodeURIComponent(query)}`;
  try {
    // 서버에 Circle 검색 결과 요청
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    // 유효한 응답일 경우
    if (response.status === 200) {
      const result = await response.json();
      return {
        filteredClubs: result.map(item => ({
          id: item.circleId,
          name: item.name,
          tags: item.hashtags,
          image: "https://via.placeholder.com/64",
        })),
        filteredPosts: null, // 현재 게시글은 null로 설정
      };
    } else {
      throw new Error(`Search Error: ${response.status}`);
    }
  } catch (error) {
    console.error("검색 오류:", error.message);
    throw error; // 오류 처리
  }
};

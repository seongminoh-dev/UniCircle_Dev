export const searchContent = async (query) => {
    try {
      // (백엔드 통신)
      // const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      // const data = await response.json();
  
      // 더미 데이터 사용
      const data = {
        filteredClubs: [
          {
            id: 1,
            name: "축구 동아리",
            image: "https://via.placeholder.com/64",
            tags: ["운동", "팀워크", "축구"],
          },
          {
            id: 2,
            name: "밴드 동아리",
            image: "https://via.placeholder.com/64",
            tags: ["음악", "공연", "밴드"],
          },
        ],
        filteredPosts: [
            {
                nickname: '닉네임A',
                club: '코딩 동아리',
                timestamp: '57분전',
                title: '정기 모임 공지',
                content: '동아리에 많은 관심을 가져주셔서 감사합니다. 앞으로도 더욱 열심히 활동할게요!',
                tags: ['태그6', '태그7'],
                views: 140,
                comments: 9,
              },
              {
                nickname: '닉네임D',
                club: '독서 동아리',
                timestamp: '10분전',
                title: '연습 경기 후기',
                content: '이번 경기에서 매우 훌륭한 성과를 얻었습니다. 다들 수고하셨습니다!',
                tags: ['태그1', '태그2', '태그3'],
                views: 206,
                comments: 63,
              }
        ],
      };
  
      return data;
    } catch (error) {
      console.error("백엔드 통신 중 오류 발생:", error);
      throw new Error("검색 데이터 가져오기 실패");
    }
  };
  
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PostPreview from "@/components/PostPreview";
import ClubPreview from "@/components/ClubPreview";
import SearchBar from "@/components/SearchBar"

const dummyClubs = [
    {
      id: 1,
      name: "축구 동아리",
      image: "https://via.placeholder.com/64", // 더미 이미지 URL
      tags: ["운동", "팀워크", "축구"],
    },
    {
      id: 2,
      name: "밴드 동아리",
      image: "https://via.placeholder.com/64", // 더미 이미지 URL
      tags: ["음악", "공연", "밴드"],
    },
    {
      id: 3,
      name: "농구 동아리",
      image: "https://via.placeholder.com/64", // 더미 이미지 URL
      tags: ["운동", "농구"],
    },
  ];
  export const dummyPosts = [
    {
      id: 1,
      title: "동아리 모집 공고",
      content: "축구 동아리에서 신입 회원을 모집합니다.",
      tags: ["모집", "축구"],
    },
    {
      id: 2,
      title: "밴드 공연 안내",
      content: "밴드 동아리의 다음 공연 일정을 알려드립니다.",
      tags: ["공연", "음악"],
    },
    {
      id: 3,
      title: "농구 대회 일정",
      content: "농구 동아리에서 진행하는 대회 일정입니다.",
      tags: [], // 빈 배열로 설정
    },
  ];

  const SearchPage = () => {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">검색 결과</h2>
  
        {/* 동아리 검색 결과 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold">동아리</h3>
          {dummyClubs.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {dummyClubs.map((club) => (
                <ClubPreview key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <p>동아리가 없습니다.</p>
          )}
        </div>
  
        {/* 게시글 검색 결과 */}
        <div>
          <h3 className="text-xl font-bold">게시글</h3>
          {dummyPosts.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {dummyPosts.map((post) => (
                <PostPreview key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p>게시글이 없습니다.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default SearchPage;
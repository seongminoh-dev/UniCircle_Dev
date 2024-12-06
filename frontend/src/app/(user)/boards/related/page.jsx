"use client";

import React from 'react';
import BoardPreview from '@/components/BoardPreview';

// 게시글 데이터를 생성
const boards = [
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
  },
  {
    nickname: '닉네임B',
    club: '사진 동아리',
    timestamp: '59분전',
    title: '동아리 모집 공고',
    content: '동아리에 많은 관심을 가져주셔서 감사합니다. 앞으로도 더욱 열심히 활동할게요!',
    tags: ['태그1', '태그2', '태그3'],
    views: 428,
    comments: 89,
  },
  {
    nickname: '닉네임C',
    club: '요리 동아리',
    timestamp: '50분전',
    title: '정기 모임 공지',
    content: '이번 모임에서 새로운 내용을 배웠습니다. 많은 도움이 되었어요.',
    tags: ['태그6', '태그7'],
    views: 120,
    comments: 31,
  },
  {
    nickname: '닉네임D',
    club: '축구 동아리',
    timestamp: '22분전',
    title: '동아리 활동 소식',
    content: '다음 달 워크샵에 대한 준비 사항을 미리 확인해주세요.',
    tags: ['태그2', '태그3', '태그5'],
    views: 340,
    comments: 12,
  },
  {
    nickname: '닉네임C',
    club: '사진 동아리',
    timestamp: '53분전',
    title: '동아리 소개 및 가입 안내',
    content: '이번 주말에 있을 동아리 활동 안내입니다.',
    tags: ['태그1', '태그2', '태그3'],
    views: 297,
    comments: 54,
  },
  {
    nickname: '닉네임A',
    club: '코딩 동아리',
    timestamp: '11분전',
    title: '동아리 모집 공고',
    content: '다들 오늘 고생 많으셨습니다! 다음 모임 때 만나요!',
    tags: ['태그1', '태그2', '태그3'],
    views: 288,
    comments: 21,
  },
  {
    nickname: '닉네임B',
    club: '음악 동아리',
    timestamp: '30분전',
    title: '정기 모임 공지',
    content: '동아리 활동이 점점 더 활발해지고 있습니다. 모두의 노력이 돋보였어요.',
    tags: ['태그1', '태그4'],
    views: 341,
    comments: 39,
  },
];



const Board = () => {
  return (
    <div className="space-y-4">
        {posts.map((post, index) => (
          <BoardPreview key={index} post={post} />
        ))}
    </div>
  );
};

export default Board;
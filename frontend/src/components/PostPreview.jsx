"use client";
import ClubTag from './ClubTag'; // ClubTag 컴포넌트 임포트

export const PostPreview = ({ post }) => {
  const { nickname, club, timestamp, title, content, tags,views,comments } = post;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-4 w-full">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold">{nickname}</h3>
                <span className="border-l-2 border-gray-300 h-5 mx-2"></span> {/* 세로선 */}
                <span className="text-sm text-gray-500">{club}</span>
            </div>
            <div className="text-gray-500">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75v10.5m6-5.25H6"
                />
                </svg>
            </div>
        </div>

        {/* Timestamp */}
        <p className="text-sm text-gray-400 mb-2 mx-2">{timestamp}</p>

        {/* Title & Content */}
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4 mx-1">{content}</p>

        {/* Tags and Stats */}
        <div className="flex justify-between items-center">
            {/* Tags */}
            <div className="flex space-x-2">
                {tags.map((tag, index) => (
                <ClubTag key={index} tag={tag} />
                ))}
            </div>

            {/* Views and Comments */}
            <div className="flex items-center space-x-4 text-gray-500 mx-4">
                {/* Views */}
                <div className="flex items-center space-x-1">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.625 7.5C0.625 7.5 3.125 2.5 7.5 2.5C11.875 2.5 14.375 7.5 14.375 7.5C14.375 7.5 11.875 12.5 7.5 12.5C3.125 12.5 0.625 7.5 0.625 7.5Z" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7.5 9.375C8.53553 9.375 9.375 8.53553 9.375 7.5C9.375 6.46447 8.53553 5.625 7.5 5.625C6.46447 5.625 5.625 6.46447 5.625 7.5C5.625 8.53553 6.46447 9.375 7.5 9.375Z" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span className="text-sm">{views}</span>
                </div>

                {/* Comments */}
                <div className="flex items-center space-x-1">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.125 9.375C13.125 9.70652 12.9933 10.0245 12.7589 10.2589C12.5245 10.4933 12.2065 10.625 11.875 10.625H4.375L1.875 13.125V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H11.875C12.2065 1.875 12.5245 2.0067 12.7589 2.24112C12.9933 2.47554 13.125 2.79348 13.125 3.125V9.375Z" stroke="#808080" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span className="text-sm">{comments}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PostPreview;

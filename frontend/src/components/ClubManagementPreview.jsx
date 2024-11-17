"use client";

import ClubTag from "./ClubTag";

const ClubManagementPreview = ({ club, onManageMembers, onEditInfo }) => {
  const { name, image, tags } = club;

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow justify-between">
      {/* Left Section: Image and Club Details */}
      <div className="flex items-center">
        {/* Club Image */}
        <div className="flex-shrink-0 w-16 h-16">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Club Details */}
        <div className="ml-4 flex flex-col">
          {/* Club Name */}
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>

          {/* Club Tags */}
          <div className="mt-2 flex space-x-2">
            {tags.map((tag, index) => (
              <ClubTag key={index} tag={tag} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={onManageMembers}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
        >
          회원 관리
        </button>
        <button
          onClick={onEditInfo}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
        >
          정보 수정
        </button>
      </div>
    </div>
  );
};

export default ClubManagementPreview;

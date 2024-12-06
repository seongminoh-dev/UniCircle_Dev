"use client";

const MemberCard = ({ nickname, email, children }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow rounded-md mb-4">
      {/* Left Section: Member Info */}
      <div className="flex items-center">
        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
          <span className="text-gray-500 text-xl">👤</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{nickname}</h3>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      {/* Right Section: Buttons */}
      <div className="flex flex-col space-y-2">{children}</div>
    </div>
  );
};

export default MemberCard;

"use client";

const MemberCard = ({ nickname, info, children }) => {
  return (
    <div className="w-60 flex flex-col items-center bg-white p-6 shadow-md rounded-md">
      {/* Avatar Section */}
      <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <span className="text-gray-500 text-2xl">👤</span>
      </div>

      {/* Nickname */}
      <h3 className="font-semibold text-gray-800 text-lg mb-2 text-center">{nickname}</h3>

      {/* Info */}
      <p className="text-sm text-gray-500 text-center">{info}</p>

      {/* Buttons */}
      <div className="flex flex-col space-y-2 mt-4">{children}</div>
    </div>
  );
};

export default MemberCard;

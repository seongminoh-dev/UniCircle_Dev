"use client";

const CircleTag = ({ tag }) => {
    return (
      <span className="inline-block h-6 w-auto bg-gray-200 text-gray-700 text-sm font-medium px-3 rounded-full">
        {tag}
      </span>
    );
  };
  
  export default CircleTag;
  
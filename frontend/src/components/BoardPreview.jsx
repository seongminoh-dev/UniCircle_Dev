"use client";

import { useRouter } from "next/navigation";
import BoardBase from "./BoardBase";

const BoardPreview = ({ board }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/boards/${board.postId}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer w-full">
      <BoardBase board={board} isPreview={true} />
    </div>
  );
};

export default BoardPreview;


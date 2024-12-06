import BoardBase from "./BoardBase";

const BoardPreview = ({ board }) => {
  return <BoardBase board={board} isPreview={true} />;
};

export default BoardPreview;

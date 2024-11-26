import PostBase from "./PostBase";

const Post = ({ post }) => {
  return <PostBase post={post} isPreview={false} />;
};

export default Post;

import PostBase from "./PostBase";

const PostPreview = ({ post }) => {
  return <PostBase post={post} isPreview={true} />;
};

export default PostPreview;

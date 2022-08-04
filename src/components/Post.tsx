import { useMemo, useState, memo } from "react";
import Paper from "@mui/material/Paper";

import Video from "./Video";
import Picture from "./Picture";
import type { Post } from "../store/gallery";

interface PostProps {
  post: Post;
}

const PostElt: React.FC<PostProps> = ({ post }) => {
  const { isVideo, urls, poster, width, height, name } = post;
  const sortedUrls = useMemo(() => [...urls].sort((a, b) => a.width - b.width), [urls]);
  const [curIndex] = useState(sortedUrls.length - 1);

  return (
    <Paper elevation={4} sx={{ borderRadius: 2, height: "100%", overflow: "hidden" }}>
      {isVideo ? (
        <Video controls loop poster={poster} width={width} height={height} source={sortedUrls[curIndex]} />
      ) : (
        <Picture source={sortedUrls[curIndex]} alt={name} width={width} height={height} />
      )}
    </Paper>
  );
};

export default memo(PostElt, (prev, next) => prev.post.id === next.post.id);

import { useMemo, useState, memo, useContext } from "react";
import Paper from "@mui/material/Paper";

import Video from "./Video";
import Picture from "./Picture";
import type { Post } from "../store/gallery";
import { SettingsContext } from "../store/settings";

interface PostProps {
  post: Post;
  interactable?: boolean;
}

const PostElt: React.FC<PostProps> = ({ post, interactable }) => {
  const { settings } = useContext(SettingsContext);
  const { isVideo, urls, poster, width, height, name } = post;
  const sortedUrls = useMemo(() => [...urls].sort((a, b) => a.width - b.width), [urls]);
  const [curIndex] = useState(Math.max(0, sortedUrls.length - 2)); // TODO: choose best based on size
  const source = sortedUrls[curIndex];

  return (
    <Paper elevation={4} sx={{ borderRadius: 2, height: "100%", overflow: "hidden" }}>
      {isVideo ? (
        <Video
          loop
          controls={interactable}
          muted={!interactable}
          autoPlay={settings.videoAutoPlay}
          poster={poster}
          width={width}
          height={height}
          source={source}
        />
      ) : (
        <Picture loading="lazy" source={sortedUrls[curIndex]} alt={name} width={width} height={height} />
      )}
    </Paper>
  );
};

PostElt.defaultProps = {
  interactable: false,
};

export default memo(PostElt, (prev, next) => prev.post.id === next.post.id && prev.interactable === next.interactable);

import { useRef, useMemo, useState, memo, useContext } from "react";
import Paper from "@mui/material/Paper";

import Video from "./Video";
import Picture from "./Picture";
import type { Post, PostSource, PostUrl } from "../store/gallery";
import { SettingsContext } from "../store/settings";
import useSize from "../hooks/useSize";
import { useEffect } from "react";

interface PostProps {
  post?: Post;
  interactable?: boolean;
}

function findIndex(sortedUrls: PostUrl[], width: number, lowDataMode: boolean): PostUrl {
  if (!lowDataMode) {
    return sortedUrls[sortedUrls.length - 1];
  }

  let index = sortedUrls.findIndex((url) => url.width > width);
  if (index < 0) {
    index = sortedUrls.length - 1;
  } else if (index > 0) {
    index -= 1;
  }

  return sortedUrls[index];
}

const PostElt: React.FC<PostProps> = ({ post, interactable }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useContext(SettingsContext);
  const size = useSize(containerRef);
  const { isVideo = false, urls = [], poster = undefined, width = 0, height = 0, name = "" } = post || {};
  const sortedUrls = useMemo(() => [...urls].sort((a, b) => a.width - b.width), [urls]);
  const [oldSource, setOldSource] = useState<PostUrl | null>(null);
  const lowDataMode = isVideo ? settings.videoLowDataMode : settings.pictureLowDataMode;
  const [source, setSource] = useState<PostUrl | null>(null);

  // effect to set source based on width
  useEffect(() => {
    if (size) {
      const newSource = findIndex(sortedUrls, size.width, lowDataMode);
      if (newSource !== source) {
        setOldSource(source);
        setSource(newSource);
      }
    }
  }, [size, lowDataMode]);

  return (
    <Paper
      ref={containerRef}
      elevation={4}
      sx={{
        borderRadius: 2,
        height: "100%",
        overflow: "hidden",
        backgroundImage: !isVideo && oldSource ? `url(${oldSource.url})` : undefined,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {source &&
        (isVideo ? (
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
          <Picture loading="lazy" source={source} alt={name} width={width} height={height} />
        ))}
    </Paper>
  );
};

PostElt.defaultProps = {
  interactable: false,
};

export default PostElt;

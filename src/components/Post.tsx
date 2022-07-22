import { useCallback, useMemo, useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";

import Video from "./Video";
import Picture from "./Picture";
import type { PostUrl } from "../store/gallery";
import { useSettingsStore } from "../store/settings";

interface PostProps {
  isVideo: boolean;
  urls: PostUrl[];
  name: string;
  width: number;
  height: number;
  poster?: string;
}

const Post: React.FC<PostProps> = ({ isVideo, urls, poster, width, height, name }) => {
  const sortedUrls = useMemo(() => [...urls].sort((a, b) => (isVideo ? b.width - a.width : a.width - b.width)), [urls]);
  const lowDataMode = useSettingsStore(
    useCallback((s) => (isVideo ? s.videoLowDataMode : s.pictureLowDataMode), [isVideo])
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [curIndex, setCurIndex] = useState(lowDataMode ? 0 : sortedUrls.length - 1);

  // Choose which image to use based on size
  const handleResize: ResizeObserverCallback = (event) => {
    const [elt] = event;
    const { contentRect } = elt;

    let index = sortedUrls.findIndex((src) => src.width > contentRect.width);
    if (index < 0) {
      index = sortedUrls.length - 1;
    } else if (index > 0) {
      index = index - 1;
    }

    setCurIndex(index);
  };

  useEffect(() => {
    if (lowDataMode) {
      const resizeObserver = new ResizeObserver(handleResize);
      const containerElt = containerRef.current;
      if (containerElt !== null) {
        resizeObserver.observe(containerElt);

        return () => {
          resizeObserver.unobserve(containerElt);
        };
      }
    }
  }, [lowDataMode]);

  return (
    <Paper
      elevation={4}
      ref={containerRef}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        width: "100%",
        height: "100%",
        backgroundImage: `url(${isVideo ? poster : sortedUrls[0].url})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {isVideo ? (
        <Video controls loop poster={poster} width={width} height={height} source={sortedUrls[curIndex]} />
      ) : (
        <Picture source={sortedUrls[curIndex]} alt={name} width={width} height={height} />
      )}
    </Paper>
  );
};

export default Post;

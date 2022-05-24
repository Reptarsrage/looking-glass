import { forwardRef, useMemo } from "react";
import styled from "@mui/system/styled";

const VideoElt = styled("video")({
  maxWidth: "100%",
  maxHeight: "100%",
});

interface Source {
  url: string;
  width: number;
  height: number;
}

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  sources: Source[];
}

interface VideoSourceProps extends Omit<React.SourceHTMLAttributes<HTMLSourceElement>, "src" | "type"> {
  src: string;
}

function getExtension(filename: string) {
  var i = filename.lastIndexOf(".");
  return i < 0 ? "" : filename.substring(i);
}

const VideoSource: React.FC<VideoSourceProps> = ({ src, ...passThroughProps }) => {
  const mimeType = useMemo(() => {
    let url = new URL(src);

    const query = new URLSearchParams(url.search.slice(1));
    const uri = query.get("uri");
    if (uri !== null) {
      url = new URL(uri);
    }

    let ext = getExtension(url.pathname).slice(1).split("?")[0];
    if (!ext || ext === "gif") {
      ext = "mp4";
    }

    return `video/${ext}`;
  }, [src]);

  return <source {...passThroughProps} src={src} type={mimeType} />;
};

const Video = forwardRef<HTMLVideoElement, VideoProps>(({ sources, ...passThroughProps }, ref) => {
  const sorted = useMemo(() => [...sources].sort((a, b) => b.width - a.width), [sources]);
  if (sources.length === 0) {
    return null;
  }

  return (
    <VideoElt ref={ref} {...passThroughProps}>
      {sorted.map((source, idx) => (
        <VideoSource key={idx} src={source.url} />
      ))}
    </VideoElt>
  );
});

export default Video;

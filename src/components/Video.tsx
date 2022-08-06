import { memo, forwardRef } from "react";
import styled from "@mui/system/styled";

const VideoElt = styled("video")({
  width: "100%",
  height: "100%",
});

interface Source {
  url: string;
  width: number;
  height: number;
}

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  source: Source;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(({ source, ...passThroughProps }, videoRef) => {
  if (!source) {
    return null;
  }

  return <VideoElt {...passThroughProps} ref={videoRef} src={source.url} />;
});

export default memo(Video, (prev, next) => prev.source === next.source);

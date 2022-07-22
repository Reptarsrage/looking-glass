import { useEffect, useRef } from "react";
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

const Video: React.FC<VideoProps> = ({ source, ...passThroughProps }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Unload video so chrome stops loading it when it does off page
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement != null) {
      if (!videoElement.hasAttribute("src")) {
        videoElement.setAttribute("src", source.url);
        videoElement.load();
      }

      return () => {
        videoElement.pause();
        videoElement.removeAttribute("src");
        videoElement.load();
      };
    }
  }, []);

  if (!source) {
    return null;
  }

  return <VideoElt {...passThroughProps} autoPlay muted ref={videoRef} src={source.url} />;
};

export default Video;

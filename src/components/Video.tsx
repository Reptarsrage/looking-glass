import React, { memo, forwardRef, useContext, useEffect, useRef } from "react";
import styled from "@mui/system/styled";
import { VolumeContext } from "../store/volume";

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

const Video = forwardRef<HTMLVideoElement, VideoProps>(({ source, ...passThroughProps }, ref) => {
  const volumeContext = useContext(VolumeContext);
  const myRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.volume = volumeContext.volume;
    }
  }, [volumeContext.volume]);

  if (!source) {
    return null;
  }

  function onVolumeChange(event: React.ChangeEvent<HTMLVideoElement>) {
    if (passThroughProps.onVolumeChange) {
      passThroughProps.onVolumeChange(event);
    }

    if (event.currentTarget.controls && !event.currentTarget.muted) {
      volumeContext.setVolume(event.currentTarget.volume);
    }
  }

  return (
    <VideoElt
      {...passThroughProps}
      ref={(node) => {
        myRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      src={source.url}
      onVolumeChange={onVolumeChange}
    />
  );
});

export default memo(Video, (prev, next) => prev.source === next.source);

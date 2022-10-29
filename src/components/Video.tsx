import React, { forwardRef, useContext, useEffect, useRef } from "react";
import styled from "@mui/system/styled";
import { VolumeContext } from "../store/volume";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

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

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ source, autoPlay, muted, controls, ...passThroughProps }, ref) => {
    const volumeContext = useContext(VolumeContext);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const isIntersecting = useIntersectionObserver({
      target: videoRef,
      threshold: 0.33,
    });

    // effect to sync volume levels across videos
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.volume = volumeContext.volume;
      }
    }, [volumeContext.volume]);

    // effect to play/pause as element leaves/enters screen
    useEffect(() => {
      if (autoPlay && isIntersecting) {
        videoRef.current?.play();
      } else {
        videoRef.current?.pause();
      }
    }, [isIntersecting]);

    function onVolumeChange(event: React.ChangeEvent<HTMLVideoElement>) {
      if (passThroughProps.onVolumeChange) {
        passThroughProps.onVolumeChange(event);
      }

      if (controls && !muted) {
        volumeContext.setVolume(event.currentTarget.volume);
      }
    }

    if (!source) {
      return null;
    }

    return (
      <VideoElt
        {...passThroughProps}
        ref={(node) => {
          videoRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        src={source.url}
        controls={controls}
        muted={muted}
        onVolumeChange={onVolumeChange}
      />
    );
  }
);

export default Video;

import clsx from 'clsx';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useForkRef, useIntersectionObserverRef } from 'rooks';
import invariant from 'tiny-invariant';

import { ReactComponent as PlayCircleIcon } from '../assets/play-circle.svg';
import useVolumeStore from '../store/volume';

interface Source {
  url: string;
  width: number;
  height: number;
}

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  source: Source;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video(
  { source, autoPlay, controls, muted: mutedProp, preload, ...passThroughProps },
  ref
) {
  const volume = useVolumeStore((state) => state.volume);
  const muted = useVolumeStore((state) => state.muted);
  const setVolume = useVolumeStore((state) => state.setVolume);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [containerRef] = useIntersectionObserverRef((entries) => {
    const entry = entries[0];
    if (entry && entry.isIntersecting !== isIntersecting) {
      setIsIntersecting(entry.isIntersecting);
    }
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const forkedRef = useForkRef(videoRef, ref);

  const [showPlay, setShowPlay] = useState(!autoPlay);
  const [showProgress, setShowProgress] = useState(true);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressDataRef = useRef({
    animationId: 0,
    videoDuration: 0,
    currentTime: 0,
    videoStartTime: 0,
    animationStartTime: Date.now(),
  });

  // effect to sync volume levels across videos
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume, muted]);

  // effect to play/pause as element leaves/enters screen
  useEffect(() => {
    if (autoPlay && isIntersecting && videoRef.current && videoRef.current.paused) {
      videoRef.current.play();
    } else if (!isIntersecting && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [isIntersecting, autoPlay]);

  useEffect(() => {
    function updateProgressBar() {
      invariant(progressBarRef.current);

      // TODO: What happens when video fails to load?

      const { animationStartTime, videoStartTime, videoDuration } = progressDataRef.current;
      const elapsedTime = (Date.now() - animationStartTime) / 1000;
      const currentTime = (elapsedTime + videoStartTime) % videoDuration;

      progressBarRef.current.style.width = `${(currentTime / videoDuration) * 100}%`;
      progressDataRef.current.animationId = requestAnimationFrame(updateProgressBar);
    }

    function startAnimation() {
      invariant(videoRef.current);

      progressDataRef.current.animationStartTime = Date.now();
      progressDataRef.current.videoDuration = videoRef.current.duration;
      progressDataRef.current.videoStartTime = videoRef.current.currentTime;
      updateProgressBar();
    }

    function stopAnimation() {
      cancelAnimationFrame(progressDataRef.current.animationId);
    }

    startAnimation();

    return () => {
      stopAnimation();
    };
  }, []);

  function onVolumeChange(event: React.ChangeEvent<HTMLVideoElement>) {
    if (passThroughProps.onVolumeChange) {
      passThroughProps.onVolumeChange(event);
    }

    if (controls && !mutedProp) {
      setVolume(event.currentTarget.muted, event.currentTarget.volume);
    }
  }

  function onMouseEnter() {
    if (controls) {
      setShowProgress(false);
    }

    if (!autoPlay) {
      setShowPlay(false);
      videoRef.current?.play();
    }
  }

  function onMouseLeave() {
    if (!videoRef.current?.paused) {
      setShowProgress(true);
    }

    if (!autoPlay) {
      setShowPlay(true);
      videoRef.current?.pause();
    }
  }

  if (!source) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-block w-full h-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <video
        className="w-auto max-w-none h-full bg-slate-700 drag-none"
        ref={forkedRef}
        src={source.url}
        onVolumeChange={onVolumeChange}
        controls={controls}
        muted={mutedProp ?? muted}
        preload={preload}
        {...passThroughProps}
      />

      <div
        className={clsx(
          'transition-opacity duration-300 absolute z-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-600 bg-opacity-80 rounded-full text-white w-1/4 aspect-square flex justify-center items-center',
          showPlay ? 'opacity-100' : 'opacity-0'
        )}
      >
        <PlayCircleIcon className="ml-1" />
      </div>

      <div
        ref={progressBarRef}
        className={clsx(
          'absolute z-10 bg-blue-400 h-1 bottom-0 left-0 rounded-md opacity-0 transition-opacity duration-300 delay-300',
          showProgress && 'opacity-100'
        )}
      />
    </div>
  );
});

export default Video;

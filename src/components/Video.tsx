import useIntersectionObserver from '@react-hook/intersection-observer';
import clsx from 'clsx';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { ReactComponent as PlayCircleIcon } from '../assets/play-circle.svg';
import useVolumeStore from '../store/volume';
import { assignRefs } from '../utils';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const volume = useVolumeStore((state) => state.volume);
  const muted = useVolumeStore((state) => state.muted);
  const setVolume = useVolumeStore((state) => state.setVolume);
  const { isIntersecting } = useIntersectionObserver(videoRef);

  const [showPlay, setShowPlay] = useState(!autoPlay);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showProgress, setShowProgress] = useState(true);

  // effect to sync volume levels across videos
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume, muted]);

  // effect to play/pause as element leaves/enters screen
  useEffect(() => {
    if (autoPlay && isIntersecting) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isIntersecting, autoPlay]);

  function onVolumeChange(event: React.ChangeEvent<HTMLVideoElement>) {
    if (passThroughProps.onVolumeChange) {
      passThroughProps.onVolumeChange(event);
    }

    if (controls && !mutedProp) {
      setVolume(event.currentTarget.muted, event.currentTarget.volume);
    }
  }

  function onLoadedMetadata(event: React.SyntheticEvent<HTMLVideoElement>) {
    if (passThroughProps.onLoadedMetadata) {
      passThroughProps.onLoadedMetadata(event);
    }

    setDuration(event.currentTarget.duration);
  }

  function onTimeUpdate(event: React.SyntheticEvent<HTMLVideoElement>) {
    if (passThroughProps.onTimeUpdate) {
      passThroughProps.onTimeUpdate(event);
    }

    setCurrentTime(event.currentTarget.currentTime);
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
    setShowProgress(true);

    if (!autoPlay) {
      setShowPlay(true);
      videoRef.current?.pause();
    }
  }

  if (!source) {
    return null;
  }

  return (
    <div className="relative inline-block w-full h-full" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <video
        className="w-auto max-w-none h-full bg-slate-700 drag-none"
        ref={assignRefs(videoRef, ref)}
        src={source.url}
        onVolumeChange={onVolumeChange}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
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

      {showProgress && (
        <div
          className={clsx(
            'absolute z-10 bg-blue-200 h-1 bottom-0 left-0',
            currentTime > 0 && 'transition-width duration-300'
          )}
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      )}
    </div>
  );
});

export default Video;

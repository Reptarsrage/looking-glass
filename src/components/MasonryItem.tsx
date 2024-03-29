import { animated, config, useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import clsx from 'clsx';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useNavigate } from 'react-router-dom';
import 'react-popper-tooltip/dist/styles.css';
import { useForkRef } from 'rooks';

import { ReactComponent as ImagesIcon } from '../assets/images.svg';
import useModule from '../hooks/useModule';
import useModalStore from '../store/modal';
import useSettingsStore from '../store/settings';
import type { Post } from '../types';

import type { MasonryItemProps as VirtualMasonryItemProps } from './ContentMasonry/VirtualizedMasonryColumn';
import Image from './Image';
import Placeholder from './Placeholder';
import Video from './Video';

interface InnerItemProps {
  post: Post;
  imageLoading?: 'lazy' | 'eager' | undefined;
  lowRes?: boolean | undefined;
  controls?: boolean | undefined;
  muted?: boolean | undefined;
  autoPlay?: boolean | undefined;
  preload?: string | undefined;
}

export function InnerItem({ post, imageLoading, lowRes, controls, muted, preload, autoPlay }: InnerItemProps) {
  const { isPlaceholder, isVideo, urls } = post;
  const sorted = useMemo(() => [...urls].sort((a, z) => z.width - a.width), [urls]);
  const lowSource = sorted[sorted.length - 1];
  const highSource = sorted[0];
  const source = lowRes ? lowSource : highSource;

  if (isPlaceholder) {
    return <Placeholder />;
  }

  if (!source) {
    return null;
  }

  if (isVideo) {
    return <Video source={source} muted={muted} autoPlay={autoPlay} loop controls={controls} preload={preload} />;
  }

  return (
    <div
      className="w-full h-full flex bg-slate-700"
      style={{
        // Show lower res image as background while larger one loads
        backgroundImage: lowRes ? undefined : `url(${lowSource?.url})`,
        backgroundSize: lowRes ? undefined : 'cover',
        backgroundRepeat: lowRes ? undefined : 'no-repeat',
      }}
    >
      <Image source={source} loading={imageLoading} />
    </div>
  );
}

InnerItem.defaultProps = {
  imageLoading: 'lazy',
  autoPlay: false,
  lowRes: true,
};

export interface MasonryItemProps extends VirtualMasonryItemProps<Post> {
  imageLoading?: 'lazy' | 'eager' | undefined;
  lowRes?: boolean;
}

function MasonryItem({ item, style, isScrolling, imageLoading, lowRes }: MasonryItemProps) {
  const { videoAutoPlay, pictureLowDataMode } = useSettingsStore((state) => state.settings);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const module = useModule();

  const toggleModal = useModalStore((state) => state.toggleModal);
  const updateModalBounds = useModalStore((state) => state.updateModalBounds);
  const modalItemId = useModalStore((state) => state.item);
  const isShownInModal = modalItemId === item.id;

  useEffect(() => {
    if (containerRef.current && isShownInModal && !isScrolling) {
      const bounds = containerRef.current.getBoundingClientRect();
      updateModalBounds(bounds);
    }
  }, [isShownInModal, isScrolling]);

  const [syles, api] = useSpring(() => ({ scale: 1, x: 0, y: 0, config: config.wobbly }));
  const bind = useGesture({
    onDragStart: () => api.start({ scale: 0.95 }),
    onDragEnd: () => {
      if (!item.isGallery) {
        api.start({
          scale: 1,
          config: { ...config.stiff, friction: 1, clamp: true },
          onRest: () => {
            if (containerRef.current) {
              const bounds = containerRef.current.getBoundingClientRect();
              toggleModal(true, bounds, item.id);
            }
          },
        });

        return;
      }

      navigate(`/module/${module.id}?galleryId=${item.id}`, { state: { gallery: item } });
    },
  });

  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

  const forkedRef = useForkRef(containerRef, setTriggerRef);

  return (
    <>
      <animated.div
        {...bind()}
        ref={forkedRef}
        style={{ ...style, ...syles }}
        className={clsx(
          'shadow touch-none rounded overflow-hidden relative',
          item.isGallery && 'cursor-pointer',
          isShownInModal && 'invisible'
        )}
      >
        <InnerItem
          post={item}
          imageLoading={imageLoading}
          lowRes={pictureLowDataMode && lowRes}
          autoPlay={videoAutoPlay}
          muted
        />
        {item.isGallery && (
          <div className="absolute top-1 right-1 bg-slate-600 bg-opacity-80 rounded-full text-white h-10 w-10 flex justify-center items-center">
            <ImagesIcon className="w-6 h-6" />
          </div>
        )}
      </animated.div>

      {/* TODO: Decide when to show tooltips */}
      {visible && item.name && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container' })}>
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
          {item.name}
        </div>
      )}
    </>
  );
}

export default memo(
  MasonryItem,
  (prev, next) =>
    prev.item === next.item &&
    prev.style === next.style &&
    prev.imageLoading === next.imageLoading &&
    prev.lowRes === next.lowRes
);

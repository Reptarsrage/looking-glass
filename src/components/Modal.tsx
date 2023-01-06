import { animated, config, useChain, useSpring, useSpringRef } from '@react-spring/web';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAddFilter from '../hooks/useAddFilter';
import useKeyPress from '../hooks/useKeyPress';
import useModule from '../hooks/useModule';
import useModalStore from '../store/modal';
import usePostStore from '../store/posts';
import type { Post } from '../types';

import Button from './Button';
import FiltersMenu from './FiltersMenu';
import { InnerItem as MasonryItem } from './MasonryItem';
import Slideshow from './SlideShow';

// Constants
const AppBarHeight = 28;
const Gutter = 16;

interface ModalProps {
  loadMore: () => void;
  isLoading: boolean;
  hasNextPage: boolean | undefined;
}

interface InnerModalProps extends ModalProps {
  close: () => void;
}

function calculateItemStartPosition(bounds: DOMRect | null) {
  if (!bounds) {
    return {};
  }

  return { x: bounds.x, y: bounds.y - AppBarHeight, width: bounds.width, height: bounds.height };
}

function calculateItemEndPosition(bounds: DOMRect | null, post: Post | null) {
  if (!bounds || !post) {
    return {};
  }

  const availableWidth = window.innerWidth - 2 * Gutter;
  const availableHeight = window.innerHeight - 2 * Gutter - AppBarHeight;

  const clampTo = Math.min(availableHeight, availableWidth);
  let clampWidth = Math.min(post.width, clampTo);
  let clampHeight = Math.min(post.height, clampTo);

  if (post.width > post.height) {
    clampHeight = (post.height / post.width) * clampWidth;
  } else {
    clampWidth = (post.width / post.height) * clampHeight;
  }

  const width = clampWidth;
  const height = clampHeight;
  const x = (availableWidth - width) / 2 + Gutter;
  const y = (availableHeight - height) / 2 + Gutter;

  return { width, height, x, y };
}

function InnerModal({ loadMore, hasNextPage, isLoading, close }: InnerModalProps) {
  const open = useModalStore((state) => state.open);
  const item = useModalStore((state) => state.item);
  const bounds = useModalStore((state) => state.bounds);
  const toggleModal = useModalStore((state) => state.toggleModal);
  const updateItem = useModalStore((state) => state.updateItem);
  const onOpen = useModalStore((state) => state.onOpen);
  const onClose = useModalStore((state) => state.onClose);
  const toggleInfo = useModalStore((state) => state.toggleInfo);
  const showInfo = useModalStore((state) => state.showInfo);

  const { supportsAuthorFilter, supportsSourceFilter } = useModule();

  const post = usePostStore((store) => (typeof item === 'string' ? store.postsById[item] : null));
  const [isTransitioning, setIsTransitioning] = useState(true);

  const addFilter = useAddFilter();

  const navigate = useNavigate();

  function closeModal() {
    toggleModal(false);
  }

  const backdropApi = useSpringRef();
  const backdropStyles = useSpring({
    ref: backdropApi,
    config: { ...config.gentle, clamp: true },
    from: { opacity: 0 },
    to: { opacity: 1 },
    reverse: !open,
  });

  const itemApi = useSpringRef();
  const itemStyles = useSpring({
    ref: itemApi,
    config: { ...config.default, clamp: true },
    from: calculateItemStartPosition(bounds),
    onStart: () => {
      setIsTransitioning(true);
    },
    onRest: () => {
      setIsTransitioning(false);

      if (!open) {
        close();
        if (onClose) {
          onClose();
        }
      } else {
        if (onOpen) {
          onOpen();
        }
      }
    },
  });

  useChain([itemApi, backdropApi], [0, 0]);

  useKeyPress('Escape', closeModal);

  useEffect(() => {
    if (open && post) {
      itemApi.start(calculateItemEndPosition(bounds, post));
    } else if (!open) {
      itemApi.start(calculateItemStartPosition(bounds));
    }
  }, [open]);

  // effect to set window title
  useEffect(() => {
    if (post) {
      window.electronAPI.setTitle(post.name);
    }
  }, [post]);

  function onAuthorClicked() {
    if (post && post.author) {
      const filterToAdd = post.author;
      toggleModal(false, undefined, undefined, () => {
        addFilter(filterToAdd);
      });
    }
  }

  function onSourceClicked() {
    if (post && post.source) {
      const filterToAdd = post.source;
      toggleModal(false, undefined, undefined, () => {
        addFilter(filterToAdd);
      });
    }
  }

  function goToGallery() {
    if (post && post.id) {
      const p = post;
      toggleModal(false, undefined, undefined, () => {
        navigate(`/module/${module.id}?galleryId=${p.id}`, { state: { gallery: p } });
      });
    }
  }

  if (!post) {
    return null;
  }

  // TODO: Transition modal button in and out
  // TODO: something weird happens when navigating that prevents modal from opening sometimes
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden" style={{ top: AppBarHeight }}>
      <animated.div style={backdropStyles} className="absolute right-0 top-1 z-30 flex gap-2 p-2 items-center">
        {post.isGallery && <Button onClick={goToGallery}>View Gallery</Button>}
        <Button onClick={toggleInfo}>Toggle Info</Button>
        <FiltersMenu />
      </animated.div>

      {showInfo && (
        <animated.div
          style={backdropStyles}
          className="absolute left-0 top-0 right-0 z-20 text-white bg-gradient-to-b from-black p-4"
        >
          <div className="text-xl">
            <h1>{post.name || 'UNTITLED'}</h1>
          </div>

          <div className="mt-2">
            {post.author && (
              <span className="mr-1">
                by{' '}
                <button
                  className="cursor-pointer hover:underline"
                  onClick={onAuthorClicked}
                  disabled={!supportsAuthorFilter}
                >
                  {post.author.name}
                </button>
              </span>
            )}

            {post.source && (
              <span className="mr-1">
                to{' '}
                <button
                  onClick={onSourceClicked}
                  className="cursor-pointer hover:underline"
                  disabled={!supportsSourceFilter}
                >
                  {post.source.name}
                </button>
              </span>
            )}

            {post.date && <span>on {new Date(post.date).toLocaleString()}</span>}
          </div>
          <div className="mt-2">
            <p>{post.description}</p>
          </div>
        </animated.div>
      )}

      <animated.div
        style={backdropStyles}
        className="absolute top-0 left-0 w-full h-full bg-gray-900 z-10"
        onClick={closeModal}
      />

      {isTransitioning ? (
        <animated.div style={itemStyles} className="fixed z-20 touch-none shadow-lg rounded-lg overflow-hidden">
          <MasonryItem post={post} imageLoading="eager" />
        </animated.div>
      ) : (
        <Slideshow
          currentItem={post.id}
          setCurrentModalItem={updateItem}
          loadMore={loadMore}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
        />
      )}
    </div>
  );
}

function Modal({ loadMore, isLoading, hasNextPage }: ModalProps) {
  const open = useModalStore((state) => state.open);
  const clearItem = useModalStore((state) => state.clearItem);
  const [shown, setShown] = useState(open);

  const close = useCallback(() => {
    setShown(false);
    clearItem();
  }, [clearItem, setShown]);

  useLayoutEffect(() => {
    if (open) {
      setShown(true);
    }
  }, [open]);

  if (!shown) {
    return null;
  }

  return <InnerModal close={close} loadMore={loadMore} isLoading={isLoading} hasNextPage={hasNextPage} />;
}

export default Modal;

import { animated, config, useTransition } from '@react-spring/web';
import clsx from 'clsx';
import React, { useCallback, useLayoutEffect, useState } from 'react';

import useKeyPress from '../hooks/useKeyPress';
import useDrawerStore from '../store/drawer';
import useModalStore from '../store/modal';
import { Post } from '../types';

import Filters from './Filters';
import FiltersForItem from './FiltersForItem';

// Constants
const AppBarHeight = 28;

interface InnerDrawerProps {
  open: boolean;
  shown: boolean;
  posts: Post[];
  onClosed: () => void;
  closeDrawer: () => void;
}

function InnerDrawer({ onClosed, closeDrawer, open, shown, posts }: InnerDrawerProps) {
  const modalIsOpen = useModalStore((state) => state.open);

  const backdropStyles = useTransition(open, {
    config: { ...config.gentle, clamp: true },
    from: { opacity: 0 },
    enter: { opacity: 0.8 },
    leave: { opacity: 0 },
    reverse: !open,
  });

  const itemStyles = useTransition(open, {
    from: { x: 400 },
    enter: { x: 0 },
    leave: { x: 400 },
    config: { mass: 1, tension: 210, friction: 22 },
    reverse: !open,
    onRest: () => {
      if (!open) {
        onClosed();
      }
    },
  });

  useKeyPress('Escape', closeDrawer);

  return (
    <div
      className={clsx(!shown && 'invisible', 'fixed top-0 left-0 w-full overflow-hidden')}
      style={{
        top: AppBarHeight,
        height: `calc(100vh - ${AppBarHeight}px)`,
      }}
    >
      {backdropStyles(
        (styles, item) =>
          item && (
            <animated.div
              style={styles}
              className="absolute top-0 left-0 w-full h-full bg-gray-900 z-10"
              onClick={closeDrawer}
            />
          )
      )}

      {itemStyles(
        (styles, item) =>
          item && (
            <animated.div
              style={styles}
              className="absolute z-20 shadow gb-white top-0 right-0 bottom-0 antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 flex flex-col"
            >
              {modalIsOpen ? <FiltersForItem posts={posts} /> : <Filters posts={posts} />}
            </animated.div>
          )
      )}
    </div>
  );
}

interface DrawerProps {
  posts: Post[];
}

function Drawer({ posts }: DrawerProps) {
  const toggleDrawer = useDrawerStore((state) => state.toggleDrawer);
  const open = useDrawerStore((state) => state.open);
  const callback = useDrawerStore((state) => state.callback);
  const [shown, setShown] = useState(open);

  const closeDrawer = useCallback(() => {
    toggleDrawer(false);
  }, [toggleDrawer]);

  const onClosed = useCallback(() => {
    setShown(false);
    if (callback) {
      callback();
    }
  }, [setShown, callback]);

  useLayoutEffect(() => {
    if (open) {
      setShown(true);
    }
  }, [open]);

  return <InnerDrawer posts={posts} open={open} shown={shown} closeDrawer={closeDrawer} onClosed={onClosed} />;
}

export default Drawer;

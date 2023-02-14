import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { InfiniteData } from 'react-query';
import { useLocation } from 'react-router-dom';
import invariant from 'tiny-invariant';

import ContentMasonry from '../components/ContentMasonry';
import Drawer from '../components/Drawer';
import Modal from '../components/Modal';
import useFilterQuery from '../hooks/useFilterQuery';
import useGalleryQuery from '../hooks/useGalleryQuery';
import useModule from '../hooks/useModule';
import useModalStore from '../store/modal';
import type { Gallery, Post } from '../types';

function flattenPages(data: InfiniteData<Gallery> | undefined): Post[] {
  if (!data) {
    return [];
  }

  return data.pages
    .map((page) => page.items)
    .flat()
    .filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i);
}

interface GalleryProps {
  isTransitioning: boolean;
  locationKey: string;
  size: DOMRect | undefined;
}

function GalleryElt({ size, isTransitioning, locationKey }: GalleryProps) {
  const location = useLocation();

  const modalItem = useModalStore((state) => state.item);
  const open = useModalStore((state) => state.open);

  const [scrollToItem, setScrollToItem] = useState<string | null>(null);

  const module = useModule();
  const moduleName = module.name;
  const moduleIcon = module.icon;

  const galleryTitle = location.state?.gallery?.name ?? moduleName;

  const modalIsOpen = useModalStore((state) => state.open);

  useFilterQuery(); // pre-fetch filters
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGalleryQuery();

  const items = useMemo(() => flattenPages(data), [data]);
  const loadMore = useCallback(() => {
    if (!isFetchingNextPage && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, isLoading, hasNextPage, fetchNextPage]);

  // effect to scroll masonry to modal item
  useEffect(() => {
    if (open) {
      setScrollToItem(modalItem);
    } else {
      setScrollToItem(null);
    }
  }, [modalItem]);

  // effect to update window title
  useEffect(() => {
    if (!isTransitioning) {
      window.electronAPI.setIcon(moduleIcon);
      window.electronAPI.setTitle(galleryTitle);
    }
  }, [galleryTitle, isTransitioning, location, locationKey, modalIsOpen, moduleIcon]);

  // TODO: Add error
  // TODO: Add no results

  const modalRoot = document.getElementById('modal-root');
  const drawerRoot = document.getElementById('drawer-root');
  invariant(modalRoot, 'modalRoot is null');
  invariant(drawerRoot, 'drawerRoot is null');

  return (
    <>
      {createPortal(
        <Modal
          loadMore={loadMore}
          isLoading={isFetchingNextPage}
          hasNextPage={hasNextPage || hasNextPage === undefined}
          posts={items}
        />,
        modalRoot
      )}
      {createPortal(<Drawer posts={items} />, drawerRoot)}

      <ContentMasonry
        items={items}
        loadMore={loadMore}
        locationKey={locationKey} // TODO: locationKey
        size={size}
        isTransitioning={isTransitioning}
        scrollToItem={scrollToItem}
        isLoading={isFetchingNextPage}
        hasNextPage={hasNextPage || hasNextPage === undefined}
      />
    </>
  );
}

export default GalleryElt;

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useInfiniteQuery } from 'react-query';
import type { InfiniteData } from 'react-query';
import { useLocation } from 'react-router-dom';

import { fetchGallery } from '../api';
import ContentMasonry from '../components/ContentMasonry';
import Drawer from '../components/Drawer';
import Modal from '../components/Modal';
import useAppParams from '../hooks/useAppParams';
import useModule from '../hooks/useModule';
import { generatePlaceholderGallery } from '../placeholderData';
import useAuthStore from '../store/authentication';
import useModalStore from '../store/modal';
import usePostStore from '../store/posts';
import type { Gallery, Post } from '../types';

type QueryKey = {
  filters: string[];
  query: string;
  sort: string;
  galleryId: string;
  moduleId: string;
};

type ReactQueryParams = {
  pageParam?: {
    offset: number;
    after: string;
  };
  queryKey: (string | QueryKey)[];
};

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

  const [appParams] = useAppParams();
  const { galleryId, filters, query, sort } = appParams;

  const modalItem = useModalStore((state) => state.item);
  const open = useModalStore((state) => state.open);

  const refreshAuth = useAuthStore((state) => state.refresh);

  const [scrollToItem, setScrollToItem] = useState<string | null>(null);

  const setPosts = usePostStore((store) => store.setPosts);

  const module = useModule();
  const moduleId = module.id;
  const moduleName = module.name;
  const moduleIcon = module.icon;

  const modalIsOpen = useModalStore((state) => state.open);

  // React query
  // This needs to be a ref so that react query doesn't cause unnecessary re-renders
  const placeholderDataRef = useRef({
    pageParams: [undefined],
    pages: [...Array(5)].map(generatePlaceholderGallery),
  });

  // React query function
  async function queryForGallery(params: ReactQueryParams): Promise<Gallery> {
    const { offset = 0, after = '' } = params.pageParam ?? {};
    const { moduleId, galleryId, query, sort, filters } = params.queryKey[1] as QueryKey;

    const accessToken = await refreshAuth(moduleId); // TODO: on error here, redirect to login page
    return await fetchGallery(moduleId, accessToken, galleryId, offset, after, query, sort, filters);
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    ['gallery', { moduleId, galleryId, query, sort, filters }],
    queryForGallery,
    {
      placeholderData: placeholderDataRef.current,
      onSuccess: (postPages) => setPosts(flattenPages(postPages)), // TODO: this can cause issues when out of date
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? { offset: lastPage.offset, after: lastPage.after } : undefined,
    }
  );

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
    window.electronAPI.setIcon(moduleIcon);
    window.electronAPI.setTitle(location.state?.gallery?.name ?? moduleName);
  }, [modalIsOpen]);

  // TODO: Add error
  // TODO: Add no results

  return (
    <>
      {createPortal(
        <Modal
          loadMore={loadMore}
          isLoading={isFetchingNextPage}
          hasNextPage={hasNextPage || hasNextPage === undefined}
        />,
        document.getElementById('modal-root')!
      )}
      {createPortal(<Drawer />, document.getElementById('drawer-root')!)}

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

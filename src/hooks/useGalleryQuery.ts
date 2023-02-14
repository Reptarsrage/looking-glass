import { useRef } from 'react';
import { useInfiniteQuery } from 'react-query';

import { fetchGallery } from '../api';
import { generatePlaceholderGallery } from '../placeholderData';
import useAuthStore from '../store/authentication';
import type { Gallery } from '../types';

import useAppParams from './useAppParams';
import useModule from './useModule';

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

function useGalleryQuery() {
  const refreshAuth = useAuthStore((state) => state.refresh);

  const module = useModule();
  const moduleId = module.id;

  const [appParams] = useAppParams();
  const { galleryId, filters, query, sort } = appParams;

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

  return useInfiniteQuery(['gallery', { moduleId, galleryId, query, sort, filters }], queryForGallery, {
    placeholderData: placeholderDataRef.current,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? { offset: lastPage.offset, after: lastPage.after } : undefined),
  });
}

export default useGalleryQuery;

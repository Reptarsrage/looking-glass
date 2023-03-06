import { useRef } from 'react';
import { useQuery } from 'react-query';

import { fetchItemFilters, isApiError } from '../api';
import { generatePlaceholderFilter } from '../placeholderData';
import useAuthStore from '../store/authentication';
import useModalStore from '../store/modal';
import type { Filter } from '../types';

import useModule from './useModule';

function useItemFilterQuery() {
  const refreshAuth = useAuthStore((state) => state.refresh);
  const invalidateAuth = useAuthStore((state) => state.invalidate);

  const module = useModule();
  const moduleId = module.id;
  const supportsItemFilters = module.supportsItemFilters;

  const modalItemId = useModalStore((state) => state.item);

  // Placeholder data for a loading section
  const placeholderDataRef = useRef<Filter[]>([...Array(10)].map(generatePlaceholderFilter));

  // React query function (filters)
  async function itemFiltersQuery(itemId: string | null) {
    if (!itemId || !supportsItemFilters) {
      return [];
    }

    try {
      const accessToken = await refreshAuth(moduleId);
      return await fetchItemFilters(moduleId, itemId, accessToken);
    } catch (ex) {
      if (isApiError(ex)) {
        if (ex.code === 401) {
          // logout
          invalidateAuth(moduleId);
        }

        throw new Error(ex.message);
      }

      throw ex;
    }
  }

  // Pre-fetch filters
  return useQuery({
    queryKey: ['filtersForItem', modalItemId],
    queryFn: () => itemFiltersQuery(modalItemId),
    placeholderData: placeholderDataRef.current,
  });
}

export default useItemFilterQuery;

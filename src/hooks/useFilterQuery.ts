import { useRef } from 'react';
import { useQueries } from 'react-query';

import { fetchFilters, isApiError } from '../api';
import { generatePlaceholderFilter } from '../placeholderData';
import useAuthStore from '../store/authentication';
import type { Filter } from '../types';

import useModule from './useModule';

function useFilterQuery() {
  const refreshAuth = useAuthStore((state) => state.refresh);
  const invalidateAuth = useAuthStore((state) => state.invalidate);

  const module = useModule();
  const moduleId = module.id;
  const moduleFilterTypes = module.filters;

  // Placeholder data for a loading section
  const placeholderDataRef = useRef<Filter[]>([...Array(10)].map(generatePlaceholderFilter));

  // React query function (filters)
  async function filtersQuery(filterSectionId: string) {
    try {
      const accessToken = await refreshAuth(moduleId);
      return await fetchFilters(moduleId, filterSectionId, accessToken);
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
  return useQueries(
    moduleFilterTypes.map((type) => ({
      queryKey: ['filters', type.id],
      queryFn: () => filtersQuery(type.id),
      placeholderData: placeholderDataRef.current,
    }))
  );
}

export default useFilterQuery;
import { useMemo } from 'react';
import { NavigateOptions, useLocation, useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export type AppParams = {
  filters: string[];
  query: string;
  sort: string;
  galleryId: string;
  moduleId: string | undefined;
};

export type SetAppParams = {
  filters?: string[];
  query?: string;
  sort?: string;
  galleryId?: string;
};

export type SetAppParamsFn = (params: SetAppParams, options?: NavigateOptions) => void;

/**
 * Handles getting and setting search params and location state used by the app.
 */
function useAppParams(): [AppParams, SetAppParamsFn] {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { moduleId } = useParams();

  return useMemo(() => {
    const appParams: AppParams = {
      filters: searchParams.getAll('filters'),
      query: searchParams.get('query') ?? '',
      sort: searchParams.get('sort') ?? '',
      galleryId: searchParams.get('galleryId') ?? '',
      moduleId: moduleId,
    };

    const setAppParams: SetAppParamsFn = (params, navigateOptions) => {
      const urlParams = new URLSearchParams();

      const mergedParams = { ...appParams, ...params };

      if (mergedParams.query) {
        urlParams.set('query', mergedParams.query);
      }

      if (mergedParams.sort) {
        urlParams.set('sort', mergedParams.sort);
      }

      if (mergedParams.galleryId) {
        urlParams.set('galleryId', mergedParams.galleryId);
      }

      if (mergedParams.filters) {
        for (const filter of mergedParams.filters) {
          urlParams.append('filters', filter);
        }
      }

      setSearchParams(urlParams, {
        ...navigateOptions,
        state: {
          ...location.state,
          ...navigateOptions?.state,
        },
      });
    };

    return [appParams, setAppParams];
  }, [searchParams, setSearchParams, moduleId, location]);
}

export default useAppParams;

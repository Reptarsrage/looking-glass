import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export interface AppSearchParams {
  filters: string[];
  query: string;
  sort: string;
  galleryId: string;
  toString: () => string;
}

export interface SetAppSearchParams {
  filters?: string[];
  query?: string;
  sort?: string;
  galleryId?: string;
}

export interface NavigationOptions {
  replace?: boolean;
  state?: any;
}

export type SetAppSearchParamsFn = (params: SetAppSearchParams, navigateOptions?: NavigationOptions) => void;

/**
 * gets and sets app-specific query parameters
 */
const useAppSearchParams = (): [AppSearchParams, SetAppSearchParamsFn] => {
  const [searchParams, setSearchParams] = useSearchParams();

  return useMemo(() => {
    const setAppSearchParams: SetAppSearchParamsFn = (params, navigateOptions) => {
      const urlParams = new URLSearchParams();
      if (params.query) {
        urlParams.set("query", params.query);
      }

      if (params.sort) {
        urlParams.set("sort", params.sort);
      }

      if (params.galleryId) {
        urlParams.set("galleryId", params.galleryId);
      }

      if (params.filters) {
        for (const filter of params.filters) {
          urlParams.append("filters", filter);
        }
      }

      setSearchParams(urlParams, navigateOptions);
    };

    const appSearchParams: AppSearchParams = {
      filters: searchParams.getAll("filters"),
      query: searchParams.get("query") ?? "",
      sort: searchParams.get("sort") ?? "",
      galleryId: searchParams.get("galleryId") ?? "",
      toString: () => searchParams.toString(),
    };

    return [appSearchParams, setAppSearchParams];
  }, [searchParams, setSearchParams]);
};

export default useAppSearchParams;

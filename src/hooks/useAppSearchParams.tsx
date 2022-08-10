import { useContext, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { RouteContext } from "../store/route";

export interface AppSearchParams {
  filters: string[];
  query: string;
  sort: string;
  galleryId: string;
  moduleId: string;
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
  const params = useParams();

  const location = useContext(RouteContext);
  const contextSearchParams = new URLSearchParams(location.search);

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
      filters: contextSearchParams.getAll("filters"),
      query: contextSearchParams.get("query") ?? "",
      sort: contextSearchParams.get("sort") ?? "",
      galleryId: contextSearchParams.get("galleryId") ?? "",
      moduleId: params.moduleId || "UNKNOWN_MODULE", // should always be set
      toString: () => contextSearchParams.toString(),
    };

    return [appSearchParams, setAppSearchParams];
  }, [searchParams, setSearchParams, location]);
};

export default useAppSearchParams;

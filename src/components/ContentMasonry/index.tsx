import { useMemo } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useInfiniteQuery } from "react-query";

import ResizeObserver from "../ResizeObserver";
import VirtualizedMasonry from "./VirtualizedMasonry";
import ContentListItem from "./ContentListItem";
import type { MasonryOnItemsRenderedParams } from "./VirtualizedMasonryColumn";
import { Gallery, Post } from "../../store/gallery";
import { useAuthStore } from "../../store/auth";
import { useSettingsStore } from "../../store/settings";
import useAppSearchParams, { AppSearchParams } from "../../hooks/useAppSearchParams";
import * as lookingGlassService from "../../services/lookingGlassService";
import * as fileSystemService from "../../services/fileSystemService";
import { MasonryContext, ModalContext, Column } from "./context";
import Modal from "../Modal";
import NoResults from "../Status/NoResults";
import { FILE_SYSTEM_MODULE_ID } from "../../store/module";
import AnErrorOccurred from "../Status/AnErrorOccurred";

interface QueryKey extends Omit<AppSearchParams, "toString"> {
  moduleId: string;
}

interface ReactQueryParams {
  pageParam?: {
    offset: number;
    after: string;
  };
  queryKey: (string | QueryKey)[];
}

// Constants
// TODO: These should probably not be hardcoded 😁
const ScrollBarWidth = 17;
const Gutter = 8;
const EstimatedItemSize = 500;
const OverscanCount = 1;

const ContentMasonry: React.FC = () => {
  // Use the location to determine what to render
  const moduleId = useParams().moduleId!;
  const [{ query, sort, filters, galleryId }] = useAppSearchParams();

  // Use the store for gallery and auth information
  const setAuth = useAuthStore((state) => state.setAuth);
  const columnCount = useSettingsStore((s) => s.masonryColumnCount);
  const auth = useAuthStore((s) => s.authByModule[moduleId]);

  // React query
  async function fetchGallery(params: ReactQueryParams): Promise<Gallery> {
    const { offset = 0, after = "" } = params.pageParam ?? {};
    const { moduleId, galleryId, query, sort, filters } = params.queryKey[1] as QueryKey;
    if (moduleId === FILE_SYSTEM_MODULE_ID) {
      // Fetch from local file system server
      return await fileSystemService.fetchGallery(galleryId, offset, sort, filters);
    }

    // Refresh auth token if necessary
    let token = auth?.accessToken;
    if (lookingGlassService.needsRefresh(auth?.expires, auth?.refreshToken)) {
      const authResponse = await lookingGlassService.refreshAuth(moduleId, auth.refreshToken);
      setAuth(moduleId, authResponse);
      token = authResponse.accessToken;
    }

    // Query for gallery page
    return await lookingGlassService.fetchGallery(moduleId, token, galleryId, offset, after, query, sort, filters);
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ["gallery", { moduleId, galleryId, query, sort, filters }],
    fetchGallery,
    {
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? { offset: lastPage.offset, after: lastPage.after } : undefined,
    }
  );

  // Memoize masonry columns
  const { items, columns } = useMemo<{ columns: Column[]; items: Post[] }>(() => {
    const items =
      data?.pages
        .flat()
        .map((g) => g.items)
        .flat() ?? [];

    const columns: Column[] = [...Array(columnCount)].map((_, idx) => ({
      id: `${galleryId}$${idx}`,
      items: [],
    }));

    items.forEach((item, idx) => {
      columns[idx % columns.length].items.push(item);
    });

    return { items, columns };
  }, [data, columnCount]);

  // When items are rendered, check if we need to fetch more
  const handleItemsRendered = (params: MasonryOnItemsRenderedParams) => {
    // If within one page of the end, fetch more!
    const startIndexOfLastPage =
      (data?.pages.slice(0, -1).reduce((acc, cur) => acc + cur.items.length, 0) ?? 0) / columnCount;
    if (hasNextPage && !isFetchingNextPage && params.visibleStartIndex > startIndexOfLastPage) {
      fetchNextPage();
    }
  };

  if (status === "loading") {
    return (
      <Box sx={{ paddingTop: "25%", textAlign: "center" }}>
        <CircularProgress size="6rem" />
      </Box>
    );
  }

  if (status === "error") {
    return <AnErrorOccurred />;
  }

  if (data === undefined || data.pages.length === 0) {
    return <NoResults />;
  }

  // TODO: Scroll restoration
  return (
    <ModalContext.Provider value={items}>
      <Modal />

      <MasonryContext.Provider value={columns}>
        <ResizeObserver>
          {({ height, width }) => (
            <VirtualizedMasonry
              onItemsRendered={handleItemsRendered}
              overscanCount={OverscanCount}
              estimatedItemSize={EstimatedItemSize}
              height={height}
              width={width}
              gutter={Gutter}
              end={!hasNextPage}
              itemSize={(column, index) => {
                // this callback could be memoized but it needs to know width
                // and it would change a lot anyways so meh
                const { width: w, height: h } = columns[column].items[index];
                return ((width - ScrollBarWidth) / columnCount - Gutter) * (h / w);
              }}
            >
              {ContentListItem}
            </VirtualizedMasonry>
          )}
        </ResizeObserver>
      </MasonryContext.Provider>
    </ModalContext.Provider>
  );
};

export default ContentMasonry;

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import ResizeObserver from "../ResizeObserver";
import VirtualizedMasonry from "./VirtualizedMasonry";
import ContentListItem from "./ContentListItem";
import type { MasonryOnItemsRenderedParams, MasonryOnScrollParams } from "./VirtualizedMasonryColumn";
import { useGalleryStore, getKey, Gallery } from "../../store/gallery";
import { useTagsStore } from "../../store/tag";
import { useAuthStore } from "../../store/auth";
import { useSettingsStore } from "../../store/settings";
import useAppSearchParams from "../../hooks/useAppSearchParams";
import * as lookingGlassService from "../../services/lookingGlassService";
import * as fileSystemService from "../../services/fileSystemService";
import { MasonryContext, Column } from "./context";
import NoResults from "../Status/NoResults";
import { FILE_SYSTEM_MODULE_ID } from "../../store/module";

// Constants
// TODO: These should probably not be hardcoded 😁
const scrollBarWidth = 17;
const gutter = 4;
const estimatedItemSize = 500;
const overscanCount = 3;

const ContentMasonry: React.FC = () => {
  // Use the location to determine what to render
  const moduleId = useParams().moduleId!;
  const location = useLocation();
  const [searchParams] = useAppSearchParams();

  // Use the store for gallery and auth information
  const galleryKey = getKey(location);
  const columnCount = useSettingsStore((s) => s.masonryColumnCount);
  const galleryExists = useGalleryStore((s) => galleryKey in s.galleriesByLocation);
  const items = useGalleryStore((s) => s.galleriesByLocation[galleryKey]?.items ?? []);
  const offset = useGalleryStore((s) => s.galleriesByLocation[galleryKey]?.offset ?? 0);
  const after = useGalleryStore((s) => s.galleriesByLocation[galleryKey]?.after ?? undefined);
  const hasNext = useGalleryStore((s) => s.galleriesByLocation[galleryKey]?.hasNext ?? true);
  const startIndexOfLastPage = useGalleryStore((s) => s.galleriesByLocation[galleryKey]?.startIndexOfLastPage ?? 0);
  const initialScrollOffset = useGalleryStore((s) => s.galleriesByLocation[galleryKey]?.scrollOffset ?? 0);
  const auth = useAuthStore((s) => s.authByModule[moduleId]);

  // Mutators
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateGallery = useGalleryStore((state) => state.updateGallery);
  const setTags = useTagsStore((state) => state.setTags);
  const updateGalleryStartIndexOfLastPage = useGalleryStore((state) => state.updateGalleryStartIndexOfLastPage);
  const updateGalleryScrollOffset = useGalleryStore((state) => state.updateGalleryScrollOffset);

  // Some state to keep track of pagination
  const [fetching, setFetching] = useState(false); // Fetching more
  const blockFetchMoreRef = useRef(true); // Don't fetch more on initial render

  // Use local variable to store scroll offset as it changes VERY often
  const scrollOffsetTracker = useRef(initialScrollOffset);

  async function fetchGallery() {
    try {
      const { query, sort, filters, galleryId } = searchParams;
      let response: Gallery;
      if (moduleId === FILE_SYSTEM_MODULE_ID) {
        // Fetch from local file system server
        response = await fileSystemService.fetchGallery(galleryId, offset, sort, filters);
      } else {
        // Refresh auth token if necessary
        let token = auth?.accessToken;
        if (lookingGlassService.needsRefresh(auth?.expires, auth?.refreshToken)) {
          const authResponse = await lookingGlassService.refreshAuth(moduleId, auth.refreshToken);
          setAuth(moduleId, authResponse);
          token = authResponse.accessToken;
        }

        // Query for gallery page
        response = await lookingGlassService.fetchGallery(
          moduleId,
          token,
          galleryId,
          offset,
          after,
          query,
          sort,
          filters
        );
      }

      // Set state
      updateGallery(galleryKey, response);

      // Update with item tags
      const allTags = response.items.map((i) => i.filters).flat();
      setTags(moduleId, allTags);
    } catch (error) {
      console.error("ERROR fetching items", error);
    } finally {
      setFetching(false);
    }
  }

  // Effect to fetch initial items
  useEffect(() => {
    blockFetchMoreRef.current = true;
    if (!galleryExists) {
      setFetching(true);
      fetchGallery();
    }

    const currentLoc = galleryKey;
    scrollOffsetTracker.current = initialScrollOffset;
    return () => {
      // Persist scroll offset
      updateGalleryScrollOffset(currentLoc, scrollOffsetTracker.current);
    };
  }, [galleryKey]);

  // Effect to save + restore scroll position
  useEffect(() => {
    const currentLoc = galleryKey;
    scrollOffsetTracker.current = initialScrollOffset;

    return () => {
      // Persist scroll offset
      updateGalleryScrollOffset(currentLoc, scrollOffsetTracker.current);
    };
  }, [galleryKey]);

  // Effect to fetch additional items
  useEffect(() => {
    if (!blockFetchMoreRef.current && galleryExists && hasNext && startIndexOfLastPage > 0 && !fetching) {
      setFetching(true);
      fetchGallery();
    }

    blockFetchMoreRef.current = false;
  }, [startIndexOfLastPage]);

  // Memoize masonry columns
  const columns = useMemo<Column[]>(() => {
    const columns: Column[] = [...Array(columnCount)].map((_, idx) => ({
      id: `${galleryKey}$${idx}`,
      items: [],
    }));

    items.forEach((item, idx) => {
      columns[idx % columns.length].items.push(item);
    });

    return columns;
  }, [galleryKey, items, columnCount]);

  // When items are rendered, check if we need to fetch more
  const handleItemsRendered = (params: MasonryOnItemsRenderedParams) => {
    // If within one page of the end, fetch more!
    if (params.visibleStartIndex > startIndexOfLastPage) {
      const idx = Math.min(...columns.map((col) => col.items.length));
      updateGalleryStartIndexOfLastPage(galleryKey, idx);
    }
  };

  // When scrolling, persist value to store
  const handleScroll = (params: MasonryOnScrollParams) => {
    scrollOffsetTracker.current = params.scrollOffset;
  };

  if (!galleryExists) {
    return (
      <Box sx={{ paddingTop: "25%", textAlign: "center" }}>
        <CircularProgress size="6rem" />
      </Box>
    );
  }

  if (items.length === 0) {
    return <NoResults />;
  }

  return (
    <MasonryContext.Provider value={columns}>
      <ResizeObserver>
        {({ height, width }) => (
          <VirtualizedMasonry
            onItemsRendered={handleItemsRendered}
            onScroll={handleScroll}
            initialScrollOffset={initialScrollOffset}
            overscanCount={overscanCount}
            estimatedItemSize={estimatedItemSize}
            height={height}
            width={width}
            gutter={gutter}
            end={!hasNext}
            itemSize={(column, index) => {
              // this callback could be memoized but it needs to know width
              // and it would change a lot anyways so meh
              const { width: w, height: h } = columns[column].items[index];
              return ((width - scrollBarWidth) / columnCount - gutter) * (h / w) + gutter;
            }}
          >
            {ContentListItem}
          </VirtualizedMasonry>
        )}
      </ResizeObserver>
    </MasonryContext.Provider>
  );
};

export default ContentMasonry;

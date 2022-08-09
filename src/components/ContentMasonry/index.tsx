import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { Gallery, GalleryContext, Post, generatePlaceholder } from "../../store/gallery";
import { AuthContext, login } from "../../store/auth";
import useAppSearchParams, { AppSearchParams } from "../../hooks/useAppSearchParams";
import * as lookingGlassService from "../../services/lookingGlassService";
import * as fileSystemService from "../../services/fileSystemService";
import { FILE_SYSTEM_MODULE_ID, ModuleContext } from "../../store/module";
import VirtualizedMasonry from "./VirtualizedMasonry";
import MasonryItem from "./VirtualizedMasonryItem";
import TheEnd from "../Status/TheEnd";
import Loading from "../Status/Loading";
import { ModalContext } from "../../store/modal";
import { TagContext } from "../../store/tag";

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

function flattenPages(data: InfiniteData<Gallery> | undefined): Post[] {
  return (
    data?.pages
      .map((page) => page.items)
      .flat()
      .filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i) ?? []
  );
}

const ContentMasonry: React.FC = () => {
  // Use the location to determine what to render
  const [{ query, sort, filters, galleryId, moduleId }] = useAppSearchParams();
  const authContext = useContext(AuthContext);
  const galleryContext = useContext(GalleryContext);
  const moduleContext = useContext(ModuleContext);
  const modalContext = useContext(ModalContext);
  const tagContext = useContext(TagContext);
  const [scrollToItem, setScrollToItem] = useState<string | null>(null);

  // Async data fetcher used by react query
  async function fetchGallery(params: ReactQueryParams): Promise<Gallery> {
    const { offset = 0, after = "" } = params.pageParam ?? {};
    const { moduleId, galleryId, query, sort, filters } = params.queryKey[1] as QueryKey;
    if (moduleId === FILE_SYSTEM_MODULE_ID) {
      // Fetch from local file system server
      return await fileSystemService.fetchGallery(galleryId, offset, sort, filters);
    }

    // Query for gallery page
    const accessToken = await login(moduleId, authContext);
    return await lookingGlassService.fetchGallery(
      moduleId,
      accessToken,
      galleryId,
      offset,
      after,
      query,
      sort,
      filters
    );
  }

  // React query
  const { data, isSuccess, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    ["gallery", { moduleId, galleryId, query, sort, filters }],
    fetchGallery,
    {
      placeholderData: () => ({
        pageParams: [undefined],
        pages: [...Array(2)].map(generatePlaceholder),
      }),
      onSuccess: (data) => {
        const flattened = flattenPages(data);
        galleryContext.setPosts(flattened);
        tagContext.addTags({ moduleId, value: flattened.map((post) => post.filters).flat() });
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? { offset: lastPage.offset, after: lastPage.after } : undefined,
    }
  );

  // effect to set window title
  useEffect(() => {
    const module = moduleContext.modules.find((module) => module.id === moduleId);
    const gallery = galleryContext.posts.find((post) => post.id === galleryId);

    if (gallery) {
      window.electronAPI.setTitle(gallery.name);
    } else if (module) {
      window.electronAPI.setTitle(module.name);
    } else {
      window.electronAPI.setTitle();
    }
  }, [galleryId]);

  // When load more element appears on screen, user has reached the bottom
  // and we should load more
  const loadMore = useCallback(() => {
    if (!isFetchingNextPage && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, isLoading, hasNextPage, fetchNextPage]);

  // Memoize the flattened react query page results
  const items = useMemo(() => flattenPages(data), [data]);

  // effect to scroll masonry to modal item
  useEffect(() => {
    if (modalContext.state.modalIsOpen) {
      setScrollToItem(modalContext.state.modalItem);
    } else {
      setScrollToItem(null);
    }
  }, [modalContext.state.modalItem]);

  return (
    <div
      style={{
        display: "flex",
        flex: "1",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {isSuccess && (
        <VirtualizedMasonry
          items={items}
          loadMore={loadMore}
          scrollToItem={scrollToItem}
          isLoading={isLoading || !!hasNextPage}
          isEnd={!hasNextPage && !isLoading}
        >
          {MasonryItem}
        </VirtualizedMasonry>
      )}
    </div>
  );
};

export default ContentMasonry;

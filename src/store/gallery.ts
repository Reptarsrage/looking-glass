import create from "zustand";
import { persist, devtools } from "zustand/middleware";
import produce from "immer";
import memoize from "memoize-one";
import type { Location } from "react-router-dom";

export interface PostUrl {
  width: number;
  height: number;
  url: string;
}

export interface PostTags {
  id: string;
  filterSectionId: string;
  name: string;
}

export interface PostAuthor {
  id: string;
  filterSectionId: string;
  name: string;
}

export interface PostSource {
  id: string;
  filterSectionId: string;
  name: string;
}

export interface Post {
  id: string;
  name: string;
  description?: string;
  width: number;
  height: number;
  isVideo: boolean;
  isGallery: boolean;
  urls: PostUrl[];
  filters: PostTags[];
  poster?: string;
  author?: PostAuthor;
  date?: string;
  source?: PostSource;
}

export interface Gallery {
  items: Post[];
  hasNext: boolean;
  offset: number;
  after?: string;
  startIndexOfLastPage?: number;
  scrollOffset?: number;
}

interface State {
  galleriesByLocation: Record<string, Gallery>;
}

interface Mutations {
  updateGalleryItemTags: (location: string, itemId: string, tags: PostTags[]) => void;
  updateGallery: (location: string, gallery: Gallery) => void;
  updateGalleryStartIndexOfLastPage: (location: string, startIndexOfLastPage: number) => void;
  updateGalleryScrollOffset: (location: string, scrollOffset: number) => void;
}

export const getKey = memoize((location: Location): string => `${location.pathname}${location.search}${location.hash}`);

const name = "gallery";
export const useGalleryStore = create<State & Mutations>(
  persist(
    devtools(
      (set) => ({
        // State
        galleriesByLocation: {},

        // Mutations
        updateGallery: (location, gallery) =>
          set(
            produce<State>((draft) => {
              // filter dupes
              const items = draft.galleriesByLocation[location]?.items ?? [];
              gallery.items = gallery.items.filter((x) => items.findIndex((y) => y.id === x.id) < 0);

              // merge state
              draft.galleriesByLocation[location] = {
                ...(draft.galleriesByLocation[location] ?? {}),
                ...gallery,
                items: items.concat(gallery.items),
              };
            }),
            false,
            `${name}/updateGallery`
          ),
        updateGalleryStartIndexOfLastPage: (location, startIndexOfLastPage) =>
          set(
            produce<State>((draft) => {
              if (location in draft.galleriesByLocation)
                draft.galleriesByLocation[location].startIndexOfLastPage = startIndexOfLastPage;
            }),
            false,
            `${name}/updateGalleryStartIndexOfLastPage`
          ),
        updateGalleryScrollOffset: (location, scrollOffset) =>
          set(
            produce<State>((draft) => {
              if (location in draft.galleriesByLocation)
                draft.galleriesByLocation[location].scrollOffset = scrollOffset;
            }),
            false,
            `${name}/updateGalleryScrollOffset`
          ),
        updateGalleryItemTags: (location, postId, tags) =>
          set(
            produce<State>((draft) => {
              if (location in draft.galleriesByLocation) {
                const item = draft.galleriesByLocation[location].items.find((i) => i.id === postId);
                if (item) {
                  item.filters = item.filters.concat(tags).filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i);
                }
              }
            }),
            false,
            `${name}/updateGalleryItemTags`
          ),
      }),
      { name }
    ),
    {
      name,
      getStorage: () => sessionStorage,
    }
  )
);

import create from "zustand";
import produce from "immer";
import { persist, devtools } from "zustand/middleware";

import type { PostTags } from "./gallery";

export interface Tag extends PostTags {}

type ModuleID = string;
type TagSectionID = string;
type PostID = string;

interface State {
  tagsByModule: Record<string, Tag[]>;
  tagSectionsLoading: Record<ModuleID, Record<TagSectionID, boolean>>;
  postTagsLoading: Record<ModuleID, Record<PostID, boolean>>;
}

interface Mutations {
  setTags: (moduleId: string, tags: Tag[]) => void;
  setTagSectionLoading: (moduleId: string, tagSectionId: string, loading: boolean) => void;
  setPostTagsLoading: (moduleId: string, postId: string, loading: boolean) => void;
}

const name = "tag";
export const useTagsStore = create<State & Mutations>(
  persist(
    devtools(
      (set) => ({
        // State
        tagsByModule: {},
        tagSectionsLoading: {},
        postTagsLoading: {},

        // Mutations
        setTags: (moduleId, tags) =>
          set(
            produce<State>((draft) => {
              draft.tagsByModule[moduleId] = (draft.tagsByModule[moduleId] ?? [])
                .concat(tags)
                .filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i);
            }),
            false,
            `${name}/setTags`
          ),
        setTagSectionLoading: (moduleId, tagSectionId, loading) =>
          set(
            produce<State>((draft) => {
              if (!(moduleId in draft.tagSectionsLoading)) {
                draft.tagSectionsLoading[moduleId] = {};
              }

              draft.tagSectionsLoading[moduleId][tagSectionId] = loading;
            }),
            false,
            `${name}/setTagSectionLoading`
          ),
        setPostTagsLoading: (moduleId, postId, loading) =>
          set(
            produce<State>((draft) => {
              if (!(moduleId in draft.postTagsLoading)) {
                draft.postTagsLoading[moduleId] = {};
              }

              draft.postTagsLoading[moduleId][postId] = loading;
            }),
            false,
            `${name}/setPostTagsLoading`
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

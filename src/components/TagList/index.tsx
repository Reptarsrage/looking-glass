import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import ResizeObserver from "../ResizeObserver";
import TagListInner from "./TagListInner";
import { TagsContext, TagSection } from "./context";
import { useTagsStore } from "../../store/tag";
import useAppSearchParams from "../../hooks/useAppSearchParams";
import { useModulesStore } from "../../store/module";
import { useModalStore } from "../../store/modal";
import { useDrawerStore } from "../../store/drawer";
import { useGalleryStore, getKey } from "../../store/gallery";
import * as lookingGlassService from "../../services/lookingGlassService";
import { useAuthStore } from "../../store/auth";

export interface TagListProps {
  overscanCount: number;
  initialScrollOffset?: number;
}

const TagList: React.FC<TagListProps> = ({ overscanCount, initialScrollOffset }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useAppSearchParams();
  const setDrawerClose = useDrawerStore((state) => state.setClose);
  const [filter, setFilter] = useState("");

  const moduleId = useParams().moduleId!;
  const sections = useModulesStore((state) => state.modules.find((m) => m.id === moduleId)?.filters ?? []);
  const supportsItemFilters = useModulesStore(
    (state) => state.modules.find((m) => m.id === moduleId)?.supportsItemFilters ?? false
  );
  const postId = useModalStore((state) => state.modalItem);
  const modalIsOpen = useModalStore((state) => state.modalIsOpen);
  const drawerIsOpen = useDrawerStore((state) => state.open);

  const location = useLocation();
  const galleryKey = getKey(location);
  const post = useGalleryStore((state) =>
    modalIsOpen ? state.galleriesByLocation[galleryKey]?.items.find((i) => i.id === postId) : undefined
  );

  const usingItemFilters = post !== undefined;
  const auth = useAuthStore((state) => state.authByModule[moduleId]);
  const updateGalleryItemTags = useGalleryStore((state) => state.updateGalleryItemTags);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setTags = useTagsStore((state) => state.setTags);
  const setPostTagsLoading = useTagsStore((state) => state.setPostTagsLoading);
  const postTagsLoading = useTagsStore(
    useCallback((state) => (post && state.postTagsLoading[moduleId]?.[post.id]) ?? true, [moduleId, post])
  );

  const filteredTagSections = useTagsStore(
    useCallback(
      (state) => {
        const included = filter.toLowerCase();
        let filters = state.tagsByModule[moduleId];
        if (usingItemFilters) {
          filters = post.filters;
        }

        filters = filters.filter((tag) => tag.name.toString().toLowerCase().includes(included));

        return sections.reduce((acc, section) => {
          let loading = state.tagSectionsLoading[moduleId]?.[section.id] ?? true;
          if (usingItemFilters && supportsItemFilters) {
            // loading is in another state?
            loading = state.postTagsLoading[moduleId]?.[post.id] ?? true;
          } else if (usingItemFilters) {
            loading = false;
          }

          const itemId = usingItemFilters ? post.id : undefined;
          const items = filters.filter((tag) => tag.filterSectionId === section.id);
          acc[section.id] = {
            ...section,
            loading,
            itemId,
            items,
          };

          return acc;
        }, {} as Record<string, TagSection>);
      },
      [post, sections, filter]
    )
  );

  useEffect(() => {
    async function fetchPostTags() {
      try {
        // Refresh auth token if necessary
        let token = auth?.accessToken;
        if (lookingGlassService.needsRefresh(auth?.expires, auth?.refreshToken)) {
          const authResponse = await lookingGlassService.refreshAuth(moduleId, auth.refreshToken);
          setAuth(moduleId, authResponse);
          token = authResponse.accessToken;
        }

        // Query for tags
        const response = await lookingGlassService.fetchItemFilters(moduleId, post!.id, token);

        setTags(moduleId, response);
        updateGalleryItemTags(galleryKey, post!.id, response);
        setPostTagsLoading(moduleId, post!.id, false);
      } catch (error) {
        console.error("ERROR fetching items", error);
      }
    }

    if (usingItemFilters && supportsItemFilters && postTagsLoading) {
      fetchPostTags();
    }
  }, [galleryKey, moduleId, post, usingItemFilters, supportsItemFilters, postTagsLoading]);

  useEffect(() => {
    if (drawerIsOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [drawerIsOpen]);

  const handleSearch: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((event) => {
    setFilter(event.currentTarget.value);
  }, []);

  const handleSubmit: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.key === "Enter") {
        if (searchParams.filters.indexOf(filter) < 0) {
          searchParams.filters.push(filter);
        }

        setSearchParams(searchParams);
        setDrawerClose();
      }
    },
    [filter]
  );

  return (
    <TagsContext.Provider value={filteredTagSections}>
      <TextField
        inputRef={inputRef}
        fullWidth
        sx={{ padding: "0.5rem", paddingRight: "17px", WebkitAppRegion: "no-drag" }}
        margin="dense"
        placeholder="Filter tags"
        variant="standard"
        value={filter}
        onChange={handleSearch}
        onKeyPress={handleSubmit}
      />
      <Box flex="1" overflow="hidden" display="flex" flexDirection="column">
        <ResizeObserver>
          {({ height }) => (
            <TagListInner
              width={360}
              height={height}
              overscanCount={overscanCount}
              initialScrollOffset={initialScrollOffset}
            />
          )}
        </ResizeObserver>
      </Box>
    </TagsContext.Provider>
  );
};

export default TagList;

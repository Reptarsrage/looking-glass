import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useQuery, useQueries } from "react-query";

import ResizeObserver from "../ResizeObserver";
import TagListInner from "./TagListInner";
import { TagsContext, TagSection } from "./context";
import useAppSearchParams from "../../hooks/useAppSearchParams";
import { useModulesStore } from "../../store/module";
import { useModalStore } from "../../store/modal";
import * as lookingGlassService from "../../services/lookingGlassService";
import { useAuthStore } from "../../store/auth";
import { Tag } from "../../store/tag";

interface ReactQueryParams {
  queryKey: (string | null)[];
}

interface PostTagsListProps {
  overscanCount: number;
  postTags?: Tag[];
  initialScrollOffset?: number;
}

interface SectionedTagsListProps {
  overscanCount: number;
  initialScrollOffset?: number;
}

interface TagListCommonProps {
  overscanCount: number;
  initialScrollOffset?: number;
  filter: string;
  onFilterChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const usePostTags = (postTags: Tag[] | undefined, filter: string) => {
  const moduleId = useParams().moduleId!;
  const sections = useModulesStore((state) => state.modules.find((m) => m.id === moduleId)?.filters ?? []);
  const supportsItemFilters = useModulesStore(
    (state) => state.modules.find((m) => m.id === moduleId)?.supportsItemFilters ?? false
  );
  const postId = useModalStore((state) => state.modalItem);
  const modalIsOpen = useModalStore((state) => state.modalIsOpen);
  const usingItemFilters = modalIsOpen && postId;
  const auth = useAuthStore((state) => state.authByModule[moduleId]);
  const setAuth = useAuthStore((state) => state.setAuth);

  // React query
  async function fetchTagsByPostId(params: ReactQueryParams): Promise<Tag[]> {
    const [, moduleId, postId] = params.queryKey;

    if (moduleId === null || postId === null) {
      return [];
    }

    if (!supportsItemFilters) {
      return postTags ?? [];
    }

    // Refresh auth token if necessary
    let token = auth?.accessToken;
    if (lookingGlassService.needsRefresh(auth?.expires, auth?.refreshToken)) {
      const authResponse = await lookingGlassService.refreshAuth(moduleId, auth.refreshToken);
      setAuth(moduleId, authResponse);
      token = authResponse.accessToken;
    }

    // Query for tags for item
    let tags = await lookingGlassService.fetchItemFilters(moduleId, postId, token);

    tags = tags.concat(postTags ?? []); // concat post tags
    tags = tags.filter((x, i, arr) => arr.findIndex((y) => y.id === x.id) === i); // remove duplicates
    tags.sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically
    return tags;
  }

  const postTagsQuery = useQuery({
    queryKey: ["tags", moduleId, postId],
    queryFn: fetchTagsByPostId,
  });

  return useMemo(() => {
    const included = filter.toLowerCase();
    return sections.reduce((acc, section, i) => {
      let loading = false;
      let error = false;
      let items: Tag[] = [];

      if (usingItemFilters) {
        loading = postTagsQuery.status === "loading";
        error = postTagsQuery.status === "error";
        items = (postTagsQuery.data ?? []).filter((tag) => tag.filterSectionId === section.id);
      }

      // filter items
      items = items.filter((tag) => tag.name.toString().toLowerCase().includes(included));

      acc[section.id] = {
        ...section,
        loading,
        error,
        items,
      };

      return acc;
    }, {} as Record<string, TagSection>);
  }, [filter, postTagsQuery, usingItemFilters]);
};

const useSectionTags = (filter: string) => {
  const moduleId = useParams().moduleId!;
  const sections = useModulesStore((state) => state.modules.find((m) => m.id === moduleId)?.filters ?? []);
  const auth = useAuthStore((state) => state.authByModule[moduleId]);
  const setAuth = useAuthStore((state) => state.setAuth);

  // React query
  async function fetchTagSectionById(params: ReactQueryParams): Promise<Tag[]> {
    const [, moduleId, sectionId] = params.queryKey;

    if (moduleId === null || sectionId === null) {
      return [];
    }

    // Refresh auth token if necessary
    let token = auth?.accessToken;
    if (lookingGlassService.needsRefresh(auth?.expires, auth?.refreshToken)) {
      const authResponse = await lookingGlassService.refreshAuth(moduleId, auth.refreshToken);
      setAuth(moduleId, authResponse);
      token = authResponse.accessToken;
    }

    // Query for tags by section
    const tags = await lookingGlassService.fetchFilters(moduleId, sectionId, token);
    tags.sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically
    tags.filter((x, i, arr) => arr.findIndex((y) => y.id === x.id) === i); // remove duplicates
    return tags;
  }

  const tagSectionQueries = useQueries(
    sections.map((section) => ({
      queryKey: ["tags", moduleId, section.id],
      queryFn: fetchTagSectionById,
    }))
  );

  return useMemo(() => {
    const included = filter.toLowerCase();
    return sections.reduce((acc, section, i) => {
      let sectionQuery = tagSectionQueries[i];
      let loading = sectionQuery.status === "loading";
      let error = sectionQuery.status === "error";
      let items = sectionQuery.data ?? [];

      // filter items
      items = items.filter((tag) => tag.name.toString().toLowerCase().includes(included));

      acc[section.id] = {
        ...section,
        loading,
        error,
        items,
      };

      return acc;
    }, {} as Record<string, TagSection>);
  }, [filter, tagSectionQueries]);
};

const TagListCommon: React.FC<TagListCommonProps> = ({
  overscanCount,
  initialScrollOffset,
  filter,
  onFilterChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useAppSearchParams();

  // Effect to focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onSubmit: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.key === "Enter") {
        if (searchParams.filters.indexOf(filter) < 0) {
          searchParams.filters.push(filter);
        }

        setSearchParams(searchParams);
      }
    },
    [filter]
  );

  return (
    <>
      <TextField
        inputRef={inputRef}
        fullWidth
        sx={{ padding: "0.5rem", paddingRight: "17px", WebkitAppRegion: "no-drag" }}
        margin="dense"
        placeholder="Filter tags"
        variant="standard"
        value={filter}
        onChange={onFilterChange}
        onKeyPress={onSubmit}
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
    </>
  );
};

export const PostTagsList: React.FC<PostTagsListProps> = ({ postTags, overscanCount, initialScrollOffset }) => {
  const [filter, setFilter] = useState("");
  const filteredTagSections = usePostTags(postTags, filter);

  const onFilterChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((event) => {
    setFilter(event.currentTarget.value);
  }, []);

  return (
    <TagsContext.Provider value={filteredTagSections}>
      <TagListCommon
        overscanCount={overscanCount}
        initialScrollOffset={initialScrollOffset}
        filter={filter}
        onFilterChange={onFilterChange}
      />
    </TagsContext.Provider>
  );
};

export const SectionedTagsList: React.FC<SectionedTagsListProps> = ({ overscanCount, initialScrollOffset }) => {
  const [filter, setFilter] = useState("");
  const filteredTagSections = useSectionTags(filter);

  const onFilterChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback((event) => {
    setFilter(event.currentTarget.value);
  }, []);

  return (
    <TagsContext.Provider value={filteredTagSections}>
      <TagListCommon
        overscanCount={overscanCount}
        initialScrollOffset={initialScrollOffset}
        filter={filter}
        onFilterChange={onFilterChange}
      />
    </TagsContext.Provider>
  );
};

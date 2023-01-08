import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueries } from 'react-query';
import invariant from 'tiny-invariant';

import { fetchFilters } from '../api';
import useAppParams from '../hooks/useAppParams';
import useKeyPress from '../hooks/useKeyPress';
import useModule from '../hooks/useModule';
import { generatePlaceholderFilter } from '../placeholderData';
import useAuthStore from '../store/authentication';
import useDrawerStore from '../store/drawer';
import { fileSystemModuleId } from '../store/modules';
import type { Filter, Post } from '../types';
import { nonNullable } from '../utils';

import FilterList from './FilterList';
import Input from './Input';

/**
 * Decrements the value with rollover
 *
 * max -> 0 -> null -> max -> 0 -> null ... ect.
 */
function decrementWithRollover(value: number | null, max: number) {
  if (value === 0) {
    return null;
  }

  if (value === null) {
    return max;
  }

  return value - 1;
}

/**
 * Increments the value with rollover
 *
 * null -> 0 -> max -> null -> 0 -> max ... ect.
 */
function incrementWithRollover(value: number | null, max: number) {
  if (value === max) {
    return null;
  }

  if (value === null) {
    return 0;
  }

  return value + 1;
}

interface FiltersProps {
  posts: Post[];
}

function Filters({ posts }: FiltersProps) {
  // Modules
  const { filters: filterTypes, id: moduleId } = useModule();

  const refreshAuth = useAuthStore((state) => state.refresh);

  const drawerOpen = useDrawerStore((state) => state.open);

  // If showing gallery, show only filters for that gallery
  const [{ galleryId }] = useAppParams();
  const isGallery = !!galleryId && moduleId !== fileSystemModuleId;

  // User text to search filters
  const [search, setSearch] = useState('');

  // Placeholder data for a loading section
  const placeholderDataRef = useRef<Filter[]>([...Array(10)].map(generatePlaceholderFilter));

  // React query function
  async function filtersQuery(filterSectionId: string) {
    const accessToken = await refreshAuth(moduleId); // TODO: on error here, redirect to login page
    return await fetchFilters(moduleId, filterSectionId, accessToken);
  }

  // Fetch all sections at once
  const filterQueries = useQueries(
    filterTypes.map((type) => ({
      queryKey: ['filters', type.id],
      queryFn: () => filtersQuery(type.id),
      placeholderData: placeholderDataRef.current,
    }))
  );

  // Memoize the flattening, sorting, and filtering of the data
  const { filters, itemCount } = useMemo(() => {
    let flattenedFilters = filterQueries
      .map((filterQuery, index) => {
        // Filter on query
        const filterType = filterTypes[index];
        invariant(filterType, 'Filter type not found');

        let items = (filterQuery.data ?? []).map((filter) => ({ filter }));

        if (isGallery) {
          items = posts
            .flatMap((post) => post.filters.filter((filter) => filter.filterSectionId === filterType.id))
            .filter((x, i, a) => a.findIndex((y) => y.id === x.id) === i)
            .map((filter) => ({ filter }));
        }

        if (search) {
          items = items.filter(
            (item) =>
              item.filter.isPlaceholder ||
              item.filter.name.toLowerCase().includes(search.toLowerCase()) ||
              filterType.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        // If section is empty, forget it
        if (items.length === 0) {
          return null;
        }

        // Build the section without counts and offsets (will be added in later step)
        const filter = {
          ...filterQuery,
          data: items,
          filterType,
          offset: 0, // TBD
          itemCount: 0, // TBD
        };

        // Sort items by name
        if (items) {
          items.sort((a, z) => a.filter.name.localeCompare(z.filter.name));
        }

        return filter;
      })
      .filter(nonNullable); // Filter out forgotten sections

    // Sort sections by name
    flattenedFilters.sort((a, z) => a.filterType.name.localeCompare(z.filterType.name));

    // Calculate offset for each section
    // NOTE: this needs to happen after sorting the sections, otherwise things are out-of-order
    let total = 0;
    flattenedFilters = flattenedFilters.map((filter) => {
      const filterItemCount = filter.data.length + 1; // include section header as item
      const filterWithOffset = {
        ...filter,
        offset: total,
        itemCount: filterItemCount,
      };

      // Keep track of total item count and offset
      total += filterItemCount;

      return filterWithOffset;
    });

    return { filters: flattenedFilters, itemCount: total };
  }, [filterQueries, search, isGallery, posts]);

  // Control tabbing and focus
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState<number | null>(null);

  /**
   * When user modifies the search query
   */
  function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  /**
   * When user moves to next focusable item
   */
  function tabNext(e: KeyboardEvent) {
    e.preventDefault();

    const totalItems = itemCount - 1 - filters.length;
    setFocused((v) => incrementWithRollover(v, totalItems));
  }

  /**
   * When user moves to previous focusable item
   */
  function tabPrev(e: KeyboardEvent) {
    e.preventDefault();
    const totalItems = itemCount - 1 - filters.length;
    setFocused((v) => decrementWithRollover(v, totalItems));
  }

  /**
   * When user presses tab
   */
  function tab(e: KeyboardEvent) {
    if (e.shiftKey) {
      tabPrev(e);
    } else {
      tabNext(e);
    }
  }

  /**
   * When user presses escape
   */
  function escape() {
    if (focused !== null) {
      setFocused(null);
    } else {
      setSearch('');
    }
  }

  /**
   * When user focuses on the search input
   */
  function onSearchInputFocused() {
    setFocused(null);
  }

  /**
   * When user focuses on a filter item
   */
  const onItemFocused = useCallback((index: number) => {
    setFocused(index);
  }, []);

  // Handle various key presses
  useKeyPress('ArrowDown', tabNext);
  useKeyPress('ArrowUp', tabPrev);
  useKeyPress('Tab', tab);
  useKeyPress('Escape', escape);

  // Effect to clear focus on open/close
  useEffect(() => {
    setFocused(null);

    const elt = inputRef.current;
    if (drawerOpen && elt) {
      setTimeout(() => elt.focus(), 500); // Focus wont work until drawer is open
    }
  }, [drawerOpen]);

  // Effect to focus search input
  useEffect(() => {
    const elt = inputRef.current;
    if (focused === null && elt) {
      elt.focus();
    }
  }, [focused]);

  // TODO: Handle errors
  // TODO: Handle empty state
  // TODO: autofocus on input

  return (
    <div className="flex flex-1 flex-col m-auto" style={{ width: 400 }}>
      <div className="p-2">
        <Input
          ref={inputRef}
          onFocus={onSearchInputFocused}
          type="text"
          placeholder="Filter items by name"
          value={search}
          onChange={onSearchChange}
        />
      </div>
      <FilterList filters={filters} itemCount={itemCount} focusOnIndex={focused} onItemFocused={onItemFocused} />
    </div>
  );
}

export default Filters;

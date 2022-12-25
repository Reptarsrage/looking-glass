import React from 'react';
import { useLocation } from 'react-router-dom';
import invariant from 'tiny-invariant';

import type { Filter } from '../types';

import useAppParams from './useAppParams';
import useModule from './useModule';

/**
 * Provides a function to add a filter to the app params.
 *
 * This logic is a bit tricky, and happens in a few locations (hence the hook).
 */
function useAddFilter() {
  const { supportsGalleryFilters, filters: sections } = useModule();
  const [appParams, setAppParams] = useAppParams();
  const location = useLocation();

  const addFilter = React.useCallback(
    (filterToAdd: Filter) => {
      // If the filter is already selected, do nothing
      if (appParams.filters.includes(filterToAdd.id)) {
        return;
      }

      // Find the section for the filter
      const section = sections.find((section) => section.id === filterToAdd.filterSectionId);
      invariant(section, 'Section not found for filter');

      // maintain a list of filter objects as state
      let filters: Filter[] = location.state?.filters ?? [];

      if (section.supportsMultiple) {
        // Remove existing filters that don't support multiple
        filters = filters.filter((filter) => {
          const filterSection = sections.find((section) => section.id === filter.filterSectionId);
          invariant(filterSection, 'Section not found for filter');
          return filterSection.supportsMultiple;
        });
      } else {
        filters = [];
      }

      // Concat filter to add
      filters = filters.concat(filterToAdd);

      // Sort by name
      filters.sort((a, z) => a.name.localeCompare(z.name));

      // Update app params
      setAppParams(
        {
          galleryId: supportsGalleryFilters ? appParams.galleryId : '',
          query: section.supportsSearch ? appParams.query : '',
          filters: filters.map((filter) => filter.id),
        },
        {
          // Filter and gallery details are stored in state
          state: {
            gallery: supportsGalleryFilters ? location.state?.gallery : undefined,
            filters,
          },
        }
      );
    },
    [appParams, setAppParams, sections, supportsGalleryFilters, location]
  );

  return addFilter;
}

export default useAddFilter;

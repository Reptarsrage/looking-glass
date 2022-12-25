import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import invariant from 'tiny-invariant';

import useAppParams from '../hooks/useAppParams';
import useModule from '../hooks/useModule';
import type { Filter } from '../types';

import Input from './Input';

export default function Search() {
  const location = useLocation();
  const [appParams, setAppParams] = useAppParams();
  const { filters: filterSections, sort: sorts, supportsGallerySearch } = useModule();
  const [value, setValue] = useState(appParams.query);

  useEffect(() => {
    setValue(appParams.query);
  }, [appParams]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let sort = appParams.sort;
    let filters: Filter[] = location.state?.filters ?? [];
    if (value) {
      // Remove filters which don't support search
      filters = filters.filter((filter) => {
        const filterSection = filterSections.find((section) => section.id === filter.filterSectionId);
        invariant(filterSection, 'Section not found for filter');
        return filterSection.supportsSearch;
      });

      // Remove sort if it doesn't support search
      if (sort) {
        const sortSection = sorts.find((section) => section.id === sort);
        invariant(sortSection, 'Section not found for sort');
        if (!sortSection.availableInSearch) {
          sort = '';
        }
      }
    }

    setAppParams(
      {
        // Update all params
        query: value,
        galleryId: supportsGallerySearch ? appParams.galleryId : '',
        filters: filters.map((filter) => filter.id),
        sort,
      },
      {
        // Make sure we keep parity with the state
        state: {
          gallery: supportsGallerySearch ? location.state?.gallery : undefined,
          filters,
        },
      }
    );
  }

  return (
    <form className="max-w-sm inline" onSubmit={onSubmit}>
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input className="pl-12" type="text" placeholder="Search" onChange={onChange} value={value} />
      </div>
    </form>
  );
}

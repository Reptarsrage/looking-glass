import { nanoid } from 'nanoid';

import { AuthType, Filter, Gallery, Module, Post } from './types';

function generatePlaceholderPost(): Post {
  function roundNearest100(num: number): number {
    return Math.round(num / 100) * 100;
  }

  function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return {
    id: nanoid(),
    name: '',
    width: roundNearest100(randomIntFromInterval(1000, 2000)),
    height: roundNearest100(randomIntFromInterval(1000, 2000)),
    isVideo: false,
    isGallery: false,
    urls: [],
    filters: [],
    isPlaceholder: true,
  };
}

export function generatePlaceholderGallery(): Gallery {
  return {
    items: [...Array(10)].map(generatePlaceholderPost),
    hasNext: false,
    offset: 0,
    isPlaceholder: true,
  };
}

export function generatePlaceholderFilter(): Filter {
  return { id: nanoid(), name: 'Loading...', isPlaceholder: true, filterSectionId: '' };
}

export function generatePlaceholderModule(): Module {
  return {
    id: nanoid(),
    name: '',
    description: '',
    authType: AuthType.None,
    icon: '',
    filters: [],
    sort: [],
    supportsItemFilters: false,
    supportsAuthorFilter: false,
    supportsSourceFilter: false,
    isPlaceholder: true,
  };
}

import { FETCH_FILTERS } from './types';

// eslint-disable-next-line import/prefer-default-export
export const fetchFilters = filterSectionId => ({
  type: FETCH_FILTERS,
  payload: filterSectionId,
});

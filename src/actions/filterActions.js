import { FETCH_FILTERS, FETCH_FILTERS_SUCCESS, FETCH_FILTERS_FAILURE } from './types';

export const fetchFilters = (filterSectionId) => ({
  type: FETCH_FILTERS,
  meta: filterSectionId,
});

export const fetchFiltersSuccess = (filterSectionId, filters) => ({
  type: FETCH_FILTERS_SUCCESS,
  payload: filters,
  meta: filterSectionId,
});

export const fetchFiltersError = (filterSectionId, error) => ({
  type: FETCH_FILTERS_FAILURE,
  payload: error,
  meta: filterSectionId,
});

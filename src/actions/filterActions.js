import {
  FETCH_FILTERS,
  FETCH_FILTERS_SUCCESS,
  FETCH_FILTERS_FAILURE,
  FETCH_ITEM_FILTERS,
  FETCH_ITEM_FILTERS_SUCCESS,
  FETCH_ITEM_FILTERS_FAILURE,
} from './types';

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

export const fetchItemFilters = (moduleId, itemId) => ({
  type: FETCH_ITEM_FILTERS,
  meta: { moduleId, itemId },
});

export const fetchItemFiltersSuccess = (moduleId, itemId, filters) => ({
  type: FETCH_ITEM_FILTERS_SUCCESS,
  payload: filters,
  meta: { moduleId, itemId },
});

export const fetchItemFiltersError = (moduleId, itemId, error) => ({
  type: FETCH_ITEM_FILTERS_FAILURE,
  payload: error,
  meta: { moduleId, itemId },
});

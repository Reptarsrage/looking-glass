import {
  FETCH_FILTERS,
  FETCH_FILTERS_SUCCESS,
  FETCH_FILTERS_FAILURE,
  FETCH_ITEM_FILTERS,
  FETCH_ITEM_FILTERS_SUCCESS,
  FETCH_ITEM_FILTERS_FAILURE,
} from './types'

/**
 * fetch filters for section
 * @param {string|number} filterSectionId Section ID
 */
export const fetchFilters = (moduleId) => ({
  type: FETCH_FILTERS,
  meta: moduleId,
})

/**
 * successfully fetched filters
 * @param {string|number} filterSectionId Section ID
 * @param {*} filters Response data
 */
export const fetchFiltersSuccess = (filterSectionId, filters) => ({
  type: FETCH_FILTERS_SUCCESS,
  payload: filters,
  meta: filterSectionId,
})

/**
 * failed to fetch filters
 * @param {string|number} filterSectionId Section ID
 * @param {Error} error Error data
 */
export const fetchFiltersError = (filterSectionId, error) => ({
  type: FETCH_FILTERS_FAILURE,
  payload: error,
  meta: filterSectionId,
})

/**
 * fetch filters for item
 * @param {string|number} moduleId Module ID
 * @param {string|number} itemId Item ID
 */
export const fetchItemFilters = (moduleId, itemId) => ({
  type: FETCH_ITEM_FILTERS,
  meta: { moduleId, itemId },
})

/**
 * successfully fetched item filters
 * @param {string|number} moduleId Module ID
 * @param {string|number} itemId Item ID
 * @param {*} filters Response data
 */
export const fetchItemFiltersSuccess = (moduleId, itemId, filters) => ({
  type: FETCH_ITEM_FILTERS_SUCCESS,
  payload: filters,
  meta: { moduleId, itemId },
})

/**
 * failed to fetch item filters
 * @param {string|number} moduleId Module ID
 * @param {string|number} itemId Item ID
 * @param {Error} error Error data
 */
export const fetchItemFiltersError = (moduleId, itemId, error) => ({
  type: FETCH_ITEM_FILTERS_FAILURE,
  payload: error,
  meta: { moduleId, itemId },
})

import { FETCH_MODULES, FETCH_MODULES_SUCCESS, FETCH_MODULES_FAILURE } from './types'

/**
 * Fetch modules
 */
export const fetchModules = () => ({
  type: FETCH_MODULES,
})

/**
 * Successfully fetched modules
 * @param {*} modules Response data
 */
export const fetchModulesSuccess = (modules) => ({
  type: FETCH_MODULES_SUCCESS,
  payload: modules,
})

/**
 * Failed to fetch modules
 * @param {Error} error Error data
 */
export const fetchModulesFailure = (error) => ({
  type: FETCH_MODULES_FAILURE,
  payload: error,
})

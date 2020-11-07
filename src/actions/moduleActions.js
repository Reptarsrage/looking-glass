import { FETCH_MODULES, FETCH_MODULES_SUCCESS, FETCH_MODULES_FAILURE } from './types'

/**
 * fetch modules
 */
export const fetchModules = () => ({
  type: FETCH_MODULES,
})

/**
 * successfully fetched modules
 * @param {*} modules Response data
 */
export const fetchModulesSuccess = (modules) => ({
  type: FETCH_MODULES_SUCCESS,
  payload: modules,
})

/**
 * failed to fetch modules
 * @param {Error} error Error data
 */
export const fetchModulesFailure = (error) => ({
  type: FETCH_MODULES_FAILURE,
  payload: error,
})

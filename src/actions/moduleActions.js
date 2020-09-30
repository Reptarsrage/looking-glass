import { FETCH_MODULES, FETCH_MODULES_SUCCESS, FETCH_MODULES_FAILURE } from './types';

export const fetchModules = () => ({
  type: FETCH_MODULES,
});

export const fetchModulesSuccess = (data) => ({
  type: FETCH_MODULES_SUCCESS,
  payload: data,
});

export const fetchModulesFailure = (error) => ({
  type: FETCH_MODULES_FAILURE,
  payload: error,
});

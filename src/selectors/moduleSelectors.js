import { createSelector } from 'reselect';

import { initialState, initialModuleState } from '../reducers/moduleReducer';

const getModuleId = (_, props) => props.moduleId;

const moduleStateSelector = (state) => state.module || initialState;

/** All modules */
export const modulesSelector = createSelector(moduleStateSelector, (state) => state.allIds);

/** Specific module */
export const moduleByIdSelector = createSelector(
  moduleStateSelector,
  getModuleId,
  (state, moduleId) => state.byId[moduleId] || initialModuleState
);

/** Have modules been fetched? */
export const fetchedSelector = createSelector(moduleStateSelector, (state) => state.fetched);

/** Are modules currently fetching? */
export const fetchingSelector = createSelector(moduleStateSelector, (state) => state.fetching);

/** Did we encounter an error while fetching modules? */
export const errorSelector = createSelector(moduleStateSelector, (state) => state.error);

/** Filter values configured for module */
export const filterBySelector = createSelector(moduleByIdSelector, (module) => module.filterBy);

/** Sort values configured for module */
export const sortBySelector = createSelector(moduleByIdSelector, (module) => module.sortBy);

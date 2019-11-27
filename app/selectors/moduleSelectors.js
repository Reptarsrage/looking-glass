import { createSelector } from 'reselect';

import { initialState } from '../reducers/moduleReducer';

const selectModules = state => (state.module || initialState).modules;

const selectModuleId = (state, props) => props.moduleId;

const fetchingSelector = createSelector(
  selectModules,
  state => state.fetching
);

const errorSelector = createSelector(
  selectModules,
  state => state.error
);

const successSelector = createSelector(
  selectModules,
  state => state.success
);

const modulesSelector = createSelector(
  selectModules,
  state => state.allIds
);

const moduleSelector = createSelector(
  [selectModules, selectModuleId],
  (state, moduleId) => state.byId[moduleId]
);

export { successSelector, fetchingSelector, errorSelector, modulesSelector, moduleSelector };

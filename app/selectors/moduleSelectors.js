import { createSelector } from 'reselect';

import { initialState } from '../reducers/moduleReducer';

const moduleState = state => state.module || initialState;

const getModuleId = (state, props) => props.moduleId;

const fetchingSelector = createSelector(
  moduleState,
  state => state.fetching
);

const errorSelector = createSelector(
  moduleState,
  state => state.error
);

const successSelector = createSelector(
  moduleState,
  state => state.success
);

const modulesSelector = createSelector(
  moduleState,
  state => state.allIds
);

const moduleSelector = createSelector(
  [moduleState, getModuleId],
  (state, moduleId) => state.byId[moduleId]
);

export { successSelector, fetchingSelector, errorSelector, modulesSelector, moduleSelector };

import { createSelector } from 'reselect';

import { initialState } from '../reducers/authReducer';

const authState = state => state.auth || initialState;

const getModuleId = (state, props) => props.moduleId;

const fetchingSelector = createSelector(
  [authState, getModuleId],
  (state, moduleId) => state.byId[moduleId].fetching
);

const errorSelector = createSelector(
  [authState, getModuleId],
  (state, moduleId) => state.byId[moduleId].error
);

const successSelector = createSelector(
  [authState, getModuleId],
  (state, moduleId) => state.byId[moduleId].success
);

const accessTokenSelector = createSelector(
  [authState, getModuleId],
  (state, moduleId) => state.byId[moduleId].accessToken
);

const refreshTokenSelector = createSelector(
  [authState, getModuleId],
  (state, moduleId) => state.byId[moduleId].refreshToken
);

const oauthURLSelector = createSelector(
  [authState, getModuleId],
  (state, moduleId) => state.byId[moduleId].oauthURL
);

const expiresSelector = createSelector(
  [authState, getModuleId],
  (state, moduleId) => state.byId[moduleId].expires
);

export {
  successSelector,
  fetchingSelector,
  errorSelector,
  accessTokenSelector,
  oauthURLSelector,
  expiresSelector,
  refreshTokenSelector,
};

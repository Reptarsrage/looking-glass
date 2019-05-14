import { createSelector } from 'reselect';

const authState = state => state.get('auth');

const fetchingSelector = () =>
  createSelector(
    authState,
    state => state.get('fetching')
  );

const errorSelector = () =>
  createSelector(
    authState,
    state => state.get('error')
  );

const successSelector = () =>
  createSelector(
    authState,
    state => state.get('success')
  );

export { successSelector, fetchingSelector, errorSelector };

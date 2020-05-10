import { createSelector } from 'reselect';

import { initialState } from '../reducers/breadcrumbReducer';

const getBreadcrumbId = (_, props) => props.breadcrumbId;

const breadcrumbState = (state) => state.breadcrumb || initialState;

const breadcrumbsSelector = createSelector(breadcrumbState, (state) => state.allIds);

const breadcrumbByIdSelector = createSelector(
  [breadcrumbState, getBreadcrumbId],
  (state, breadcrumbId) => state.byId[breadcrumbId]
);

export { breadcrumbsSelector, breadcrumbByIdSelector };

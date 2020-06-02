import { put, call, takeEvery, select } from 'redux-saga/effects';

import LookingGlassService from '../services/lookingGlassService';
import { FETCH_FILTERS } from '../actions/types';
import { accessTokenSelector } from '../selectors/authSelectors';
import { filterSectionByIdSelector } from '../selectors/filterSectionSelectors';
import { moduleByIdSelector } from '../selectors/moduleSelectors';
import { handleRefresh } from './authSagas';
import { fetchFiltersError, fetchFiltersSuccess } from '../actions/filterActions';

function* handleFetchFilters(action) {
  const { meta: filterSectionId } = action;
  const filterSection = yield select(filterSectionByIdSelector, { filterSectionId });
  const { moduleId } = filterSection;
  const module = yield select(moduleByIdSelector, { moduleId });

  try {
    // resolve service
    const service = new LookingGlassService();

    // refresh token (if needed)
    yield call(handleRefresh, { meta: moduleId });

    // get data
    const accessToken = yield select(accessTokenSelector, { moduleId });
    const { data } = yield call(service.fetchFilters, module.siteId, filterSection.siteId, accessToken);

    // mark completed
    yield put(fetchFiltersSuccess(filterSectionId, data));
  } catch (e) {
    console.error(e, 'Error fetching filters');
    yield put(fetchFiltersError(filterSectionId, e));
  }
}

function* watchFilterSagas() {
  yield takeEvery(FETCH_FILTERS, handleFetchFilters);
}

export default watchFilterSagas;

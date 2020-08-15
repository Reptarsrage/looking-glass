import { put, call, takeEvery, select, all } from 'redux-saga/effects';

import LookingGlassService from '../services/lookingGlassService';
import { FETCH_FILTERS, FETCH_ITEM_FILTERS } from '../actions/types';
import { accessTokenSelector } from '../selectors/authSelectors';
import { filterSectionByIdSelector } from '../selectors/filterSectionSelectors';
import { itemByIdSelector } from '../selectors/itemSelectors';
import { moduleByIdSelector } from '../selectors/moduleSelectors';
import { handleRefresh } from './authSagas';
import {
  fetchFiltersError,
  fetchFiltersSuccess,
  fetchItemFiltersError,
  fetchItemFiltersSuccess,
} from '../actions/filterActions';

function* handleFetchItemFilters(action) {
  const { meta } = action;
  const { itemId, moduleId } = meta;
  const item = yield select(itemByIdSelector, { itemId });
  const module = yield select(moduleByIdSelector, { moduleId });

  try {
    // resolve service
    const service = new LookingGlassService();

    // refresh token (if needed)
    yield call(handleRefresh, { meta: moduleId });

    // get data
    const accessToken = yield select(accessTokenSelector, { moduleId });
    const { data } = yield call(service.fetchItemFilters, module.siteId, item.siteId, accessToken);

    // mark completed
    yield put(fetchItemFiltersSuccess(moduleId, itemId, data));
  } catch (e) {
    console.error(e, 'Error fetching filters');
    yield put(fetchItemFiltersError(moduleId, itemId, e));
  }
}

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
  yield all([
    yield takeEvery(FETCH_FILTERS, handleFetchFilters),
    yield takeEvery(FETCH_ITEM_FILTERS, handleFetchItemFilters),
  ]);
}

export default watchFilterSagas;

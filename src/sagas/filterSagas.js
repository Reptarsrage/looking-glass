import { put, call, takeEvery, select, all } from 'redux-saga/effects'

import lookingGlassService from 'services/lookingGlassService'
import { FETCH_FILTERS, FETCH_ITEM_FILTERS } from 'actions/types'
import { accessTokenSelector } from 'selectors/authSelectors'
import { filterSectionSiteIdSelector, filterSectionModuleIdSelector } from 'selectors/filterSectionSelectors'
import { itemSiteIdSelector } from 'selectors/itemSelectors'
import { moduleSiteIdSelector } from 'selectors/moduleSelectors'
import {
  fetchFiltersError,
  fetchFiltersSuccess,
  fetchItemFiltersError,
  fetchItemFiltersSuccess,
} from 'actions/filterActions'
import { handleRefresh } from './authSagas'

/**
 * saga to handle fetching filters for an item
 * @param {*} action Dispatched action
 */
export function* handleFetchItemFilters(action) {
  const { meta } = action
  const { itemId, moduleId } = meta

  try {
    // refresh token
    yield call(handleRefresh, moduleId)

    // select info from the redux store
    const itemSiteId = yield select(itemSiteIdSelector, { itemId })
    const moduleSiteId = yield select(moduleSiteIdSelector, { moduleId })
    const accessToken = yield select(accessTokenSelector, { moduleId })

    // fetch item filters
    const { data } = yield call(lookingGlassService.fetchItemFilters, moduleSiteId, itemSiteId, accessToken)

    // put info into the store
    yield put(fetchItemFiltersSuccess(moduleId, itemId, data))
  } catch (error) {
    // encountered an error
    console.error(error, 'Error fetching filters')
    yield put(fetchItemFiltersError(moduleId, itemId, error))
  }
}

/**
 * saga to handle fetching a section of filters
 * @param {*} action Dispatched action
 */
export function* handleFetchFilters(action) {
  const { meta: filterSectionId } = action

  try {
    // select info from the redux store
    const filterSectionSiteId = yield select(filterSectionSiteIdSelector, { filterSectionId })
    const moduleId = yield select(filterSectionModuleIdSelector, { filterSectionId })

    // refresh token
    yield call(handleRefresh, moduleId)

    // select additional info from the redux store
    const moduleSiteId = yield select(moduleSiteIdSelector, { moduleId })
    const accessToken = yield select(accessTokenSelector, { moduleId })

    // fetch filters
    const { data } = yield call(lookingGlassService.fetchFilters, moduleSiteId, filterSectionSiteId, accessToken)

    // put info into the store
    yield put(fetchFiltersSuccess(filterSectionId, data))
  } catch (error) {
    // encountered an error
    console.error(error, 'Error fetching filters')
    yield put(fetchFiltersError(filterSectionId, error))
  }
}

export default function* watchFilterSagas() {
  yield all([takeEvery(FETCH_FILTERS, handleFetchFilters), takeEvery(FETCH_ITEM_FILTERS, handleFetchItemFilters)])
}

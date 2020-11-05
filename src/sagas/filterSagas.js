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
 * Saga to handle fetching filters for an item
 * @param {*} action Dispatched action
 */
export function* handleFetchItemFilters(action) {
  const { meta } = action
  const { itemId, moduleId } = meta

  try {
    // Refresh token
    yield call(handleRefresh, moduleId)

    // Select info from the redux store
    const itemSiteId = yield select(itemSiteIdSelector, { itemId })
    const moduleSiteId = yield select(moduleSiteIdSelector, { moduleId })
    const accessToken = yield select(accessTokenSelector, { moduleId })

    // Fetch item filters
    const { data } = yield call(lookingGlassService.fetchItemFilters, moduleSiteId, itemSiteId, accessToken)

    // Put info into the store
    yield put(fetchItemFiltersSuccess(moduleId, itemId, data))
  } catch (error) {
    // Encountered an error
    console.error(error, 'Error fetching filters')
    yield put(fetchItemFiltersError(moduleId, itemId, error))
  }
}

/**
 * Saga to handle fetching a section of filters
 * @param {*} action Dispatched action
 */
export function* handleFetchFilters(action) {
  const { meta: filterSectionId } = action

  try {
    // Select info from the redux store
    const filterSectionSiteId = yield select(filterSectionSiteIdSelector, { filterSectionId })
    const moduleId = yield select(filterSectionModuleIdSelector, { filterSectionId })

    // Refresh token
    yield call(handleRefresh, moduleId)

    // Select additional info from the redux store
    const moduleSiteId = yield select(moduleSiteIdSelector, { moduleId })
    const accessToken = yield select(accessTokenSelector, { moduleId })

    // Fetch filters
    const { data } = yield call(lookingGlassService.fetchFilters, moduleSiteId, filterSectionSiteId, accessToken)

    // Put info into the store
    yield put(fetchFiltersSuccess(filterSectionId, data))
  } catch (error) {
    // Encountered an error
    console.error(error, 'Error fetching filters')
    yield put(fetchFiltersError(filterSectionId, error))
  }
}

export default function* watchFilterSagas() {
  yield all([takeEvery(FETCH_FILTERS, handleFetchFilters), takeEvery(FETCH_ITEM_FILTERS, handleFetchItemFilters)])
}

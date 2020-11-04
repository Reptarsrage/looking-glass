import { put, call, takeLatest, all, select, delay, cancelled, takeEvery } from 'redux-saga/effects'

import lookingGlassService from '../services/lookingGlassService'
import fileSystemService from '../services/fileSystemService'
import { FETCH_GALLERY, FILTER_CHANGE, SORT_CHANGE, SEARCH_CHANGE } from '../actions/types'
import { accessTokenSelector } from '../selectors/authSelectors'
import {
  gallerySiteIdSelector,
  galleryModuleIdSelector,
  currentSortSelector,
  currentFilterSelector,
  currentSearchQuerySelector,
  galleryAfterSelector,
  galleryOffsetSelector,
} from '../selectors/gallerySelectors'
import { moduleSiteIdSelector, defaultGalleryIdSelector } from '../selectors/moduleSelectors'
import { valueSiteIdSelector, defaultSortValueSelector } from '../selectors/sortSelectors'
import { filterSiteIdSelector } from '../selectors/filterSelectors'
import { handleRefresh } from './authSagas'
import { FILE_SYSTEM_MODULE_ID } from '../reducers/constants'
import {
  fetchGallery,
  updateSort,
  updateSearch,
  updateFilter,
  fetchGallerySuccess,
  fetchGalleryFailure,
  clearGallery,
} from '../actions/galleryActions'

/**
 * Saga to handle changes in sort value
 * @param {*} action Dispatched action
 */
export function* handleSortChange(action) {
  const { meta: galleryId, payload: valueId } = action

  // Select info from the redux store
  const currentValueId = yield select(currentSortSelector, { galleryId })

  // If changed, clear and fetch new items
  if (currentValueId !== valueId) {
    yield put(clearGallery(galleryId))
    yield put(updateSort(galleryId, valueId))
    yield put(fetchGallery(galleryId))
  }
}

/**
 * Saga to handle changes in filter value
 * @param {*} action Dispatched action
 */
export function* handleFilterChange(action) {
  const { meta: galleryId, payload: filterId } = action

  // Select info from the redux store
  const currentFilterId = yield select(currentFilterSelector, { galleryId })

  // If changed, clear and fetch new items
  if (currentFilterId !== filterId) {
    yield put(clearGallery(galleryId))
    yield put(updateFilter(galleryId, filterId))
    yield put(fetchGallery(galleryId))
  }
}

/**
 * Saga to handle changes in search query value
 * @param {*} action Dispatched action
 */
export function* handleSearchChange(action) {
  const { meta: galleryId, payload: searchQuery } = action

  // Select info from the redux store
  const currentSearchQuery = yield select(currentSearchQuerySelector, { galleryId })

  // If changed, clear items
  if (currentSearchQuery !== searchQuery) {
    yield put(clearGallery(galleryId))
    yield put(updateSearch(galleryId, searchQuery))

    // Wait for user to finish typing
    yield delay(500)
    if (yield cancelled()) {
      return
    }

    // Fetch items after user is done typing
    yield put(fetchGallery(galleryId))
  }
}

/**
 * Saga to handle fetching items
 * @param {*} action Dispatched action
 */
export function* handleFetchGallery(action) {
  const { meta: galleryId } = action

  try {
    // Select info from the redux store
    const moduleId = yield select(galleryModuleIdSelector, { galleryId })
    const defaultGalleryId = yield select(defaultGalleryIdSelector, { moduleId })
    const gallerySiteId = yield select(gallerySiteIdSelector, { galleryId })
    const moduleSiteId = yield select(moduleSiteIdSelector, { moduleId })
    const currentFilterId = yield select(currentFilterSelector, { galleryId })
    const currentValueId = yield select(currentSortSelector, { galleryId })
    const currentSearchQuery = yield select(currentSearchQuerySelector, { galleryId })
    const after = yield select(galleryAfterSelector, { galleryId })
    const offset = yield select(galleryOffsetSelector, { galleryId })
    const defaultSort = yield select(defaultSortValueSelector, { moduleId })
    const sortValueSiteId = yield select(valueSiteIdSelector, { valueId: currentValueId || defaultSort })
    const filterSiteId = yield select(filterSiteIdSelector, { filterId: currentFilterId })

    // Resolve service
    const service = moduleId === FILE_SYSTEM_MODULE_ID ? fileSystemService : lookingGlassService

    // Refresh token
    yield call(handleRefresh, moduleId)

    // Select additional info from the redux store
    const accessToken = yield select(accessTokenSelector, { moduleId })

    // Fetch items
    const { data } = yield call(
      service.fetchItems,
      moduleSiteId,
      galleryId === defaultGalleryId ? null : gallerySiteId,
      accessToken,
      offset,
      after,
      currentSearchQuery,
      sortValueSiteId,
      filterSiteId
    )

    // Put info into the store
    yield put(fetchGallerySuccess(moduleId, galleryId, data))
  } catch (error) {
    // Encountered an error
    console.error(error, 'Error fetching gallery')
    yield put(fetchGalleryFailure(galleryId, error))
  }
}

export default function* watchGallerySagas() {
  yield all([
    takeEvery(FETCH_GALLERY, handleFetchGallery),
    takeLatest(SEARCH_CHANGE, handleSearchChange),
    takeEvery(SORT_CHANGE, handleSortChange),
    takeEvery(FILTER_CHANGE, handleFilterChange),
  ])
}

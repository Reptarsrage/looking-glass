import { put, call, takeLatest, all, select, delay, cancelled, takeEvery } from 'redux-saga/effects'

import lookingGlassService from 'services/lookingGlassService'
import fileSystemService from 'services/fileSystemService'
import { FETCH_GALLERY, FILTER_CHANGE, SORT_CHANGE, SEARCH_CHANGE } from 'actions/types'
import { accessTokenSelector } from 'selectors/authSelectors'
import {
  gallerySiteIdSelector,
  galleryModuleIdSelector,
  gallerySortSelector,
  galleryFilterSelector,
  gallerySearchQuerySelector,
  galleryAfterSelector,
  galleryOffsetSelector,
} from 'selectors/gallerySelectors'
import { moduleSiteIdSelector, moduleDefaultGalleryIdSelector } from 'selectors/moduleSelectors'
import { valueSiteIdSelector, defaultSortValueSelector } from 'selectors/sortSelectors'
import { filterSiteIdSelector } from 'selectors/filterSelectors'
import { FILE_SYSTEM_MODULE_ID } from 'reducers/constants'
import {
  fetchGallery,
  updateSort,
  updateSearch,
  updateFilter,
  fetchGallerySuccess,
  fetchGalleryFailure,
  clearGallery,
} from 'actions/galleryActions'
import { handleRefresh } from './authSagas'
import logger from '../logger'

/**
 * saga to handle changes in sort value
 * @param {*} action Dispatched action
 */
export function* handleSortChange(action) {
  const { meta: galleryId, payload: valueId } = action

  // select info from the redux store
  const currentValueId = yield select(gallerySortSelector, { galleryId })

  // if changed, clear and fetch new items
  if (currentValueId !== valueId) {
    yield put(clearGallery(galleryId))
    yield put(updateSort(galleryId, valueId))
    yield put(fetchGallery(galleryId))
  }
}

/**
 * saga to handle changes in filter value
 * @param {*} action Dispatched action
 */
export function* handleFilterChange(action) {
  const { meta: galleryId, payload: filterId } = action

  // select info from the redux store
  const currentFilterId = yield select(galleryFilterSelector, { galleryId })

  // if changed, clear and fetch new items
  if (currentFilterId !== filterId) {
    yield put(clearGallery(galleryId))
    yield put(updateFilter(galleryId, filterId))
    yield put(fetchGallery(galleryId))
  }
}

/**
 * saga to handle changes in search query value
 * @param {*} action Dispatched action
 */
export function* handleSearchChange(action) {
  const { meta: galleryId, payload: searchQuery } = action

  // select info from the redux store
  const currentSearchQuery = yield select(gallerySearchQuerySelector, { galleryId })

  // if changed, clear items
  if (currentSearchQuery !== searchQuery) {
    yield put(clearGallery(galleryId))
    yield put(updateSearch(galleryId, searchQuery))

    // wait for user to finish typing
    yield delay(500)
    if (yield cancelled()) {
      return
    }

    // fetch items after user is done typing
    yield put(fetchGallery(galleryId))
  }
}

/**
 * saga to handle fetching items
 * @param {*} action Dispatched action
 */
export function* handleFetchGallery(action) {
  const { meta: galleryId } = action

  try {
    // select info from the redux store
    const moduleId = yield select(galleryModuleIdSelector, { galleryId })
    const defaultGalleryId = yield select(moduleDefaultGalleryIdSelector, { moduleId })
    const gallerySiteId = yield select(gallerySiteIdSelector, { galleryId })
    const moduleSiteId = yield select(moduleSiteIdSelector, { moduleId })
    const currentFilterId = yield select(galleryFilterSelector, { galleryId })
    const currentValueId = yield select(gallerySortSelector, { galleryId })
    const currentSearchQuery = yield select(gallerySearchQuerySelector, { galleryId })
    const after = yield select(galleryAfterSelector, { galleryId })
    const offset = yield select(galleryOffsetSelector, { galleryId })
    const defaultSort = yield select(defaultSortValueSelector, { moduleId, galleryId })
    const sortValueSiteId = yield select(valueSiteIdSelector, { galleryId, valueId: currentValueId || defaultSort })
    const filterSiteId = yield select(filterSiteIdSelector, { filterId: currentFilterId })

    // resolve service
    const service = moduleId === FILE_SYSTEM_MODULE_ID ? fileSystemService : lookingGlassService

    // refresh token
    yield call(handleRefresh, moduleId)

    // select additional info from the redux store
    const accessToken = yield select(accessTokenSelector, { moduleId })

    // fetch items
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

    // put info into the store
    yield put(fetchGallerySuccess(moduleId, galleryId, data))
  } catch (error) {
    // encountered an error
    logger.error(error, 'Error fetching gallery')
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

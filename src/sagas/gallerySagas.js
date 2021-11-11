import { put, call, takeLatest, all, select, delay, cancelled, takeEvery } from 'redux-saga/effects'
import qs from 'qs'

import lookingGlassService from 'services/lookingGlassService'
import fileSystemService from 'services/fileSystemService'
import { FETCH_GALLERY, FILTER_ADDED, FILTER_REMOVED, SORT_CHANGE, SEARCH_CHANGE } from 'actions/types'
import { accessTokenSelector } from 'selectors/authSelectors'
import {
  gallerySiteIdSelector,
  galleryModuleIdSelector,
  galleryAfterSelector,
  galleryOffsetSelector,
} from 'selectors/gallerySelectors'
import { modalOpenSelector } from 'selectors/modalSelectors'
import { moduleSiteIdSelector, moduleDefaultGalleryIdSelector } from 'selectors/moduleSelectors'
import { valueSiteIdSelector, defaultSortValueSelector } from 'selectors/sortSelectors'
import { filterSiteIdSelector, filterSectionIdSelector } from 'selectors/filterSelectors'
import {
  filterSectionSupportsMultipleSelector,
  filterSectionSupportsSearchSelector,
} from 'selectors/filterSectionSelectors'
import { FILE_SYSTEM_MODULE_ID } from 'reducers/constants'
import { fetchGallerySuccess, fetchGalleryFailure, clearGallery, fetchGallery } from 'actions/galleryActions'
import { modalClose } from 'actions/modalActions'
import { handleRefresh } from './authSagas'
import takeLatestPerKey from './takeLatestPerKey'
import logger from '../logger'

/**
 * converts URLSearchParams entries to an object
 */
const paramsToObject = (searchParams) =>
  [...searchParams.entries()].reduce((acc, [key, value]) => {
    acc[key] = value
    return acc
  }, {})

/**
 * saga to handle changes in sort value
 * @param {*} action Dispatched action
 */
export function* handleSortChange(action) {
  const { meta, payload: value } = action
  const { galleryId, navigate, location, searchParams } = meta
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || ''
  let filters = searchParams.get('filters') || ''
  filters = filters.split(',').filter(Boolean)

  if (sort !== value) {
    yield put(clearGallery(galleryId))
    yield put(fetchGallery(galleryId, filters, value, search))

    navigate(`${location.pathname}?${qs.stringify({ ...paramsToObject(searchParams), sort: value })}`, {
      replace: true,
    })
  }
}

/**
 * saga to handle changes in filter value
 * @param {*} action Dispatched action
 */
export function* handleFilterAdded(action) {
  const { meta, payload: filterId } = action
  const { galleryId, navigate, location, searchParams, clearAll } = meta
  const sort = searchParams.get('sort') || ''
  let search = searchParams.get('search') || ''
  let filters = searchParams.get('filters') || ''
  filters = filters.split(',').filter(Boolean)

  // check if filter is currently selected
  if (filters.indexOf(filterId) >= 0) {
    return
  }

  // check if filter supports multiple
  const moduleId = yield select(galleryModuleIdSelector, { galleryId })
  const defaultGalleryId = yield select(moduleDefaultGalleryIdSelector, { moduleId })
  const filterSectionId = yield select(filterSectionIdSelector, { filterId })
  const supportsMultiple = yield select(filterSectionSupportsMultipleSelector, { filterSectionId })
  if (!supportsMultiple || clearAll) {
    filters = []
  } else {
    // remove all other filters that do not support multiple
    filters = (yield all(filters.map(filterSupportsMultiple))).filter(Boolean)
  }

  // check if searching, and filter is available in search
  const supportsSearch = yield select(filterSectionSupportsSearchSelector, { filterSectionId })
  if (!supportsSearch) {
    search = ''
  }

  // add it
  filters.push(filterId)

  // close modal
  if (yield select(modalOpenSelector)) {
    yield put(modalClose())
  }

  /// clear and fetch next gallery
  const nextGalleryId = moduleId === FILE_SYSTEM_MODULE_ID ? galleryId : defaultGalleryId
  yield put(clearGallery(nextGalleryId))
  yield put(fetchGallery(nextGalleryId, filters, sort, search))

  // navigate
  const qParams = { ...paramsToObject(searchParams), search, filters: filters.join(',') }
  const base = supportsSearch ? location.pathname.split('/')[1] : 'gallery'
  navigate(`/${base}/${moduleId}/${nextGalleryId}?${qs.stringify(qParams)}`)
}

/**
 * saga to handle changes in filter value
 * @param {*} action Dispatched action
 */
export function* handleFilterRemoved(action) {
  const { meta, payload: value } = action
  const { galleryId, navigate, location, searchParams } = meta
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || ''
  let filters = searchParams.get('filters') || ''
  filters = filters.split(',').filter(Boolean)

  if (filters.indexOf(value) < 0) {
    return
  }
  const moduleId = yield select(galleryModuleIdSelector, { galleryId })
  const defaultGalleryId = yield select(moduleDefaultGalleryIdSelector, { moduleId })

  // remove it
  filters = filters.filter((filter) => filter !== value)

  /// clear and fetch next gallery
  const nextGalleryId = moduleId === FILE_SYSTEM_MODULE_ID ? galleryId : defaultGalleryId
  yield put(clearGallery(nextGalleryId))
  yield put(fetchGallery(nextGalleryId, filters, sort, search))

  // navigate
  const qParams = { ...paramsToObject(searchParams), filters: filters.join(',') }
  const base = location.pathname.split('/')[1]
  navigate(`/${base}/${moduleId}/${nextGalleryId}?${qs.stringify(qParams)}`)
}

/**
 * saga to handle changes in search query value
 * @param {*} action Dispatched action
 */
export function* handleSearchChange(action) {
  const { meta, payload } = action
  const { galleryId, navigate, searchParams } = meta
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || ''
  let filters = searchParams.get('filters') || ''
  filters = filters.split(',').filter(Boolean)
  const value = payload.trim()

  // if changed
  if (search === value) {
    return
  }

  // wait for user to finish typing
  yield delay(500)
  if (yield cancelled()) {
    return
  }

  // remove all filters that do not support search
  if (filters.length > 0) {
    filters = yield all(filters.map((filterId) => filterSupportsSearch(filterId, value)))
  }

  const moduleId = yield select(galleryModuleIdSelector, { galleryId })
  const defaultGalleryId = yield select(moduleDefaultGalleryIdSelector, { moduleId })

  let base = 'search'
  if (base === 'search' && !value) {
    // navigate back to gallery
    base = 'gallery'
  }

  /// clear and fetch next gallery
  yield put(clearGallery(defaultGalleryId))
  yield put(fetchGallery(defaultGalleryId, filters, sort, value))

  // navigate
  const qParams = { ...paramsToObject(searchParams), search: value, filters: filters.join(',') }
  navigate(`/${base}/${moduleId}/${defaultGalleryId}?${qs.stringify(qParams)}`)
}

/**
 * saga to handle fetching items
 * @param {*} action Dispatched action
 */
export function* handleFetchGallery(action) {
  const { meta: galleryId, payload } = action
  const { filters, sort, search } = payload

  // select module info
  const moduleId = yield select(galleryModuleIdSelector, { galleryId })
  const defaultGalleryId = yield select(moduleDefaultGalleryIdSelector, { moduleId })
  const moduleSiteId = yield select(moduleSiteIdSelector, { moduleId })

  // select gallery info
  const gallerySiteId = yield select(gallerySiteIdSelector, { galleryId })
  const after = yield select(galleryAfterSelector, { galleryId })
  const offset = yield select(galleryOffsetSelector, { galleryId })
  const defaultSort = yield select(defaultSortValueSelector, { moduleId, galleryId, search })

  // select sort info
  let sortValueSiteId = null
  if (sort || defaultSort) {
    sortValueSiteId = yield select(valueSiteIdSelector, { galleryId, valueId: sort || defaultSort })
  }

  // select filter info
  let filterSiteIds = []
  if (Array.isArray(filters) && filters.length > 0) {
    filterSiteIds = yield all(filters.map((filterId) => select(filterSiteIdSelector, { filterId })))
  }

  // resolve service
  const service = moduleId === FILE_SYSTEM_MODULE_ID ? fileSystemService : lookingGlassService

  try {
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
      search,
      sortValueSiteId,
      filterSiteIds
    )

    yield put(fetchGallerySuccess(moduleId, galleryId, data))
  } catch (error) {
    // encountered an error
    logger.error(error, 'Error fetching gallery')
    yield put(fetchGalleryFailure(galleryId, error))
  }
}

// remove all filters that do not play well with others
function* filterSupportsMultiple(filterId) {
  const filterSectionId = yield select(filterSectionIdSelector, { filterId })
  const supportsMultiple = yield select(filterSectionSupportsMultipleSelector, { filterSectionId })

  if (supportsMultiple) {
    return filterId
  }

  return false
}

// remove all filters that do not support search
function* filterSupportsSearch(filterId, searchValue) {
  const filterSectionId = yield select(filterSectionIdSelector, { filterId })
  const supportsSearch = yield select(filterSectionSupportsSearchSelector, { filterSectionId })

  if (!searchValue || supportsSearch) {
    return filterId
  }

  return false
}

export function fetchGalleryKeySelector(action) {
  return action.meta
}

export default function* watchGallerySagas() {
  yield all([
    takeLatestPerKey(FETCH_GALLERY, handleFetchGallery, fetchGalleryKeySelector),
    takeLatest(SEARCH_CHANGE, handleSearchChange),
    takeEvery(SORT_CHANGE, handleSortChange),
    takeEvery(FILTER_ADDED, handleFilterAdded),
    takeEvery(FILTER_REMOVED, handleFilterRemoved),
  ])
}

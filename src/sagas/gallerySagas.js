import { put, call, takeLatest, all, select, delay, cancelled, takeEvery } from 'redux-saga/effects'
import qs from 'querystring'

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
import { moduleSiteIdSelector, moduleDefaultGalleryIdSelector } from 'selectors/moduleSelectors'
import { valueSiteIdSelector, defaultSortValueSelector } from 'selectors/sortSelectors'
import { filterSiteIdSelector } from 'selectors/filterSelectors'
import { FILE_SYSTEM_MODULE_ID } from 'reducers/constants'
import { fetchGallerySuccess, fetchGalleryFailure, clearGallery } from 'actions/galleryActions'
import { handleRefresh } from './authSagas'
import logger from '../logger'

/**
 * saga to handle changes in sort value
 * @param {*} action Dispatched action
 */
export function* handleSortChange(action) {
  const { meta, payload: value } = action
  const { galleryId, history } = meta
  const { pathname, search } = history.location
  const query = qs.parse(search.substring(1))

  if (query.sort !== value) {
    history.push(`${pathname}?${qs.stringify({ ...query, sort: value })}`)
    yield put(clearGallery(galleryId))
  }
}

/**
 * saga to handle changes in filter value
 * @param {*} action Dispatched action
 */
export function* handleFilterAdded(action) {
  const { meta, payload: value } = action
  const { galleryId, history } = meta
  const { pathname, search } = history.location
  const query = qs.parse(search.substring(1))
  const filters = (query.filters || '').split(',').filter(Boolean)

  if (filters.indexOf(value) < 0) {
    // add it
    filters.push(value)

    history.push(`${pathname}?${qs.stringify({ ...query, filters: filters.join(',') })}`)
    yield put(clearGallery(galleryId))
  }
}

/**
 * saga to handle changes in filter value
 * @param {*} action Dispatched action
 */
export function* handleFilterRemoved(action) {
  const { meta, payload: value } = action
  const { galleryId, history } = meta
  const { pathname, search } = history.location
  const query = qs.parse(search.substring(1))
  let filters = (query.filters || '').split(',').filter(Boolean)

  if (filters.indexOf(value) >= 0) {
    // remove it
    filters = filters.filter((filter) => filter !== value)

    // TODO: The order here matters, why?
    history.push(`${pathname}?${qs.stringify({ ...query, filters: filters.join(',') })}`)
    yield put(clearGallery(galleryId))
  }
}

/**
 * saga to handle changes in search query value
 * @param {*} action Dispatched action
 */
export function* handleSearchChange(action) {
  const { meta, payload: value } = action
  const { galleryId, history } = meta
  const { pathname, search } = history.location
  let query = qs.parse(search.substring(1))

  // if changed, clear items
  if (query.search !== value) {
    // wait for user to finish typing
    yield delay(500)
    if (yield cancelled()) {
      return
    }

    query = { ...query, search: value }
    if (pathname.startsWith('/search') && !value) {
      // navigate back to gallery
      history.push(`${pathname.replace('search', 'gallery')}?${qs.stringify(query)}`)
    } else if (pathname.startsWith('/search')) {
      // update search in qs
      history.replace(`${pathname}?${qs.stringify(query)}`)
    } else {
      // navigate to search
      history.push(`${pathname.replace('gallery', 'search')}?${qs.stringify(query)}`)
    }

    yield put(clearGallery(galleryId))
  }
}

/**
 * saga to handle fetching items
 * @param {*} action Dispatched action
 */
export function* handleFetchGallery(action) {
  const { meta: galleryId, payload } = action
  const { filters, sort, search } = payload

  try {
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
    takeEvery(FILTER_ADDED, handleFilterAdded),
    takeEvery(FILTER_REMOVED, handleFilterRemoved),
  ])
}

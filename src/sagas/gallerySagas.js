import { put, call, takeLatest, all, select, delay, cancelled, takeEvery } from 'redux-saga/effects';

import LookingGlassService from '../services/lookingGlassService';
import FileSystemService from '../services/fileSystemService';
import { FETCH_GALLERY, FILTER_CHANGE, SORT_CHANGE, SEARCH_CHANGE } from '../actions/types';
import { accessTokenSelector } from '../selectors/authSelectors';
import {
  galleryByIdSelector,
  currentSortSelector,
  currentFilterSelector,
  currentSearchQuerySelector,
} from '../selectors/gallerySelectors';
import { moduleByIdSelector } from '../selectors/moduleSelectors';
import { valueSiteIdSelector, defaultSortValueSelector } from '../selectors/sortSelectors';
import { filterSiteIdSelector } from '../selectors/filterSelectors';
import { handleRefresh } from './authSagas';
import { FILE_SYSTEM_MODULE_ID } from '../reducers/constants';
import {
  fetchGallery,
  updateSort,
  updateSearch,
  updateFilter,
  fetchGallerySuccess,
  fetchGalleryFailure,
  clearGallery,
} from '../actions/galleryActions';

const fsService = new FileSystemService();

function* handleSortChange(action) {
  const { meta: galleryId, payload: valueId } = action;
  const currentValueId = yield select(currentSortSelector, { galleryId });
  if (currentValueId !== valueId) {
    yield put(clearGallery(galleryId));
    yield put(updateSort(galleryId, valueId));
    yield put(fetchGallery(galleryId));
  }
}

function* handleFilterChange(action) {
  const { meta: galleryId, payload: filterId } = action;
  const currentFilterId = yield select(currentFilterSelector, { galleryId });
  if (currentFilterId !== filterId) {
    yield put(clearGallery(galleryId));
    yield put(updateFilter(galleryId, filterId));
    yield put(fetchGallery(galleryId));
  }
}

function* handleSearchChange(action) {
  const { meta: galleryId, payload: searchQuery } = action;
  const currentSearchQuery = yield select(currentSearchQuerySelector, { galleryId });
  if (currentSearchQuery !== searchQuery) {
    yield put(clearGallery(galleryId));
    yield put(updateSearch(galleryId, searchQuery));
  }

  // wait for user to finish typing
  yield delay(500);
  if (yield cancelled()) {
    return;
  }

  // fetch gallery after user is done typing
  yield put(fetchGallery(galleryId));
}

function* handleFetchGallery(action) {
  const { meta: galleryId } = action;
  const gallery = yield select(galleryByIdSelector, { galleryId });
  const { moduleId } = gallery;
  const module = yield select(moduleByIdSelector, { moduleId });

  try {
    // resolve service
    let service;
    if (moduleId === FILE_SYSTEM_MODULE_ID) {
      service = fsService;
    } else {
      service = new LookingGlassService();
    }

    // refresh token (if needed)
    yield call(handleRefresh, { meta: moduleId });

    // get data
    const accessToken = yield select(accessTokenSelector, { moduleId });
    const defaultSort = yield select(defaultSortValueSelector, { moduleId });
    const sort = yield select(valueSiteIdSelector, { valueId: gallery.currentSort || defaultSort });
    const filter = yield select(filterSiteIdSelector, { filterId: gallery.currentFilter });

    const { data } = yield call(
      service.fetchImages,
      module.siteId,
      gallery.siteId,
      accessToken,
      gallery.offset,
      gallery.count,
      gallery.after,
      gallery.searchQuery,
      sort,
      filter
    );

    yield put(fetchGallerySuccess(moduleId, galleryId, data));
  } catch (error) {
    console.error(error, 'Error fetching gallery');
    yield put(fetchGalleryFailure(galleryId, error));
  }
}

function* watchGallerySagas() {
  yield all([
    takeEvery(FETCH_GALLERY, handleFetchGallery),
    takeLatest(SEARCH_CHANGE, handleSearchChange),
    takeLatest(SORT_CHANGE, handleSortChange),
    takeLatest(FILTER_CHANGE, handleFilterChange),
  ]);
}

export default watchGallerySagas;

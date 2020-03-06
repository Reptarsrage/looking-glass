import { put, call, takeLatest, all, select, delay, cancelled, takeEvery } from 'redux-saga/effects';
import { animateScroll } from 'react-scroll';

import LookingGlassService from '../services/lookingGlassService';
import FileSystemService from '../services/fileSystemService';
import {
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_ERROR,
  FILTER_CHANGE,
  SORT_CHANGE,
  SEARCH_CHANGE,
} from '../actions/types';
import { accessTokenSelector } from '../selectors/authSelectors';
import { galleryByIdSelector, currentSortSelector, currentFilterSelector } from '../selectors/gallerySelectors';
import { galleryIdSelector } from '../selectors/appSelectors';
import { moduleByIdSelector, searchGalleryIdSelector } from '../selectors/moduleSelectors';
import { valueSiteIdSelector, defaultSortValueSelector } from '../selectors/sortSelectors';
import { filterSiteIdSelector } from '../selectors/filterSelectors';
import { handleRefresh } from './authSagas';
import { FILE_SYSTEM_MODULE_ID } from '../reducers/constants';
import { fetchGallery, updateSort, clearGallery, updateSearch, updateFilter } from '../actions/moduleActions';
import { navigateToSearch, navigateFromSearch } from '../actions/navigationActions';

const fsService = new FileSystemService();

function* handleSortChange(action) {
  const { meta, payload } = action;
  const { moduleId, galleryId } = meta;
  const valueId = payload;

  const currentSort = yield select(currentSortSelector, { moduleId });

  if (currentSort !== valueId) {
    yield put(clearGallery(galleryId));
    yield put(updateSort(galleryId, valueId));
    yield put(fetchGallery(moduleId, galleryId));
  }
}

function* handleFilterChange(action) {
  const { meta, payload } = action;
  const { moduleId, galleryId } = meta;
  const filterId = payload;

  const currentFilter = yield select(currentFilterSelector, { galleryId });
  if (currentFilter !== filterId) {
    yield put(clearGallery(galleryId));
    yield put(updateFilter(galleryId, filterId));
    yield put(fetchGallery(moduleId, galleryId));
  }
}

function* handleSearchChange(action) {
  const { meta, payload: query } = action;
  const { galleryId, moduleId } = meta;

  const searchGalleryId = yield select(searchGalleryIdSelector, { moduleId });
  const currentGalleryId = yield select(galleryIdSelector, { moduleId });

  yield put(updateSearch(searchGalleryId, query));

  if (query && searchGalleryId !== currentGalleryId) {
    // Searching, navigate to search gallery
    yield put(navigateToSearch(moduleId));
  } else if (!query && searchGalleryId === currentGalleryId) {
    // Done Searching, navigate back to default gallery
    yield put(navigateFromSearch(moduleId));
  }

  // Wait for user to finish typing
  yield delay(500);
  if (yield cancelled()) {
    return;
  }

  if (query) {
    // Searching, clear and fetch results
    yield put(clearGallery(galleryId));

    // Hack to reset scroll position when searching
    sessionStorage.removeItem(`${moduleId}/${galleryId}`);
    animateScroll.scrollToTop({
      duration: 0,
      delay: 0,
      containerId: 'scroll-container',
    });

    yield put(fetchGallery(moduleId, galleryId));
  } else {
    // Not searching anymore,. clear out old filters and sort
    yield put(clearGallery(galleryId));
    yield put(updateFilter(galleryId, null));
    yield put(updateSort(galleryId, null));
  }
}

function* handleFetchGallery(action) {
  const { payload } = action;
  const { moduleId, galleryId } = payload;

  const module = yield select(moduleByIdSelector, { moduleId });
  const gallery = yield select(galleryByIdSelector, { galleryId });

  try {
    // resolve service
    let service;
    if (moduleId === FILE_SYSTEM_MODULE_ID) {
      service = fsService;
    } else {
      service = new LookingGlassService();
    }

    // refresh token (if needed)
    yield call(handleRefresh, { meta: { moduleId } });

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

    yield put({ type: FETCH_GALLERY_SUCCESS, payload: data, meta: galleryId });
  } catch (e) {
    console.error(e, 'Error fetching gallery');
    yield put({ type: FETCH_GALLERY_ERROR, payload: e, meta: galleryId });
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

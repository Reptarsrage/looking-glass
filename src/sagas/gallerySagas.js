import { put, call, takeLatest, all, select, delay, cancelled } from 'redux-saga/effects';

import LookingGlassService from '../services/lookingGlassService';
import FileSystemService from '../services/fileSystemService';
import {
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_ERROR,
  UPDATE_SEARCH,
  SORT_CHANGE,
} from '../actions/types';
import { accessTokenSelector } from '../selectors/authSelectors';
import { galleryByIdSelector, currentSortSelector } from '../selectors/gallerySelectors';
import { moduleByIdSelector } from '../selectors/moduleSelectors';
import { valueSiteIdSelector, defaultSortValueSelector } from '../selectors/sortSelectors';
import { handleRefresh } from './authSagas';
import { FILE_SYSTEM_MODULE_ID } from '../reducers/constants';
import { fetchGallery, updateSort, clearGallery } from '../actions/moduleActions';

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

function* handleUpdateSearch(action) {
  const { meta } = action;
  const { galleryId, moduleId } = meta;

  yield delay(500);
  if (yield cancelled()) {
    return;
  }

  yield put(clearGallery(galleryId));
  yield put(fetchGallery(moduleId, galleryId));
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

    const { data } = yield call(
      service.fetchImages,
      module.siteId,
      gallery.siteId,
      accessToken,
      gallery.offset,
      gallery.before,
      gallery.after,
      gallery.searchQuery,
      sort
    );

    yield put({ type: FETCH_GALLERY_SUCCESS, payload: data, meta: galleryId });
  } catch (e) {
    console.error(e, 'Error fetching gallery');
    yield put({ type: FETCH_GALLERY_ERROR, payload: e, meta: galleryId });
  }
}

function* watchGallerySagas() {
  yield all([
    takeLatest(FETCH_GALLERY, handleFetchGallery),
    takeLatest(UPDATE_SEARCH, handleUpdateSearch),
    takeLatest(SORT_CHANGE, handleSortChange),
  ]);
}

export default watchGallerySagas;

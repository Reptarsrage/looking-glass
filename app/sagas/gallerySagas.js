import { put, call, takeLatest, all, select, delay, cancelled } from 'redux-saga/effects';

import LookingGlassService from '../services/lookingGlassService';
import FileSystemService from '../services/fileSystemService';
import {
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_ERROR,
  UPDATE_SEARCH,
  CLEAR_GALLERY,
} from '../actions/types';
import { accessTokenSelector } from '../selectors/authSelectors';
import { galleryByIdSelector } from '../selectors/gallerySelectors';
import { moduleByIdSelector } from '../selectors/moduleSelectors';
import { handleRefresh } from './authSagas';

const fsService = new FileSystemService();

function* handleUpdateSearch(action) {
  const { meta } = action;
  const { moduleId, galleryId } = meta;

  yield delay(500);
  if (yield cancelled()) {
    return;
  }

  yield put({ type: CLEAR_GALLERY, meta: { moduleId, galleryId } });
  yield put({ type: FETCH_GALLERY, meta: { moduleId, galleryId } });
}

function* handleFetchImages(action) {
  const { payload } = action;
  const { moduleId, galleryId } = payload;

  const module = yield select(moduleByIdSelector, { moduleId });
  const gallery = yield select(galleryByIdSelector, { galleryId });

  try {
    // resolve service
    let service;
    if (moduleId === 'fs') {
      service = fsService;
    } else {
      service = new LookingGlassService();
    }

    // refresh token (if needed)
    yield call(handleRefresh, { meta: { moduleId } });

    // get data
    const accessToken = yield select(accessTokenSelector, { moduleId });

    const { data } = yield call(
      service.fetchImages,
      module.siteId,
      gallery.siteId,
      accessToken,
      gallery.offset,
      gallery.before,
      gallery.after,
      gallery.searchQuery
    );

    yield put({ type: FETCH_GALLERY_SUCCESS, payload: data, meta: galleryId });
  } catch (e) {
    console.error(e, 'Error fetching gallery');
    yield put({ type: FETCH_GALLERY_ERROR, payload: e, meta: galleryId });
  }
}

function* watchGallerySagas() {
  yield all([takeLatest(FETCH_GALLERY, handleFetchImages), takeLatest(UPDATE_SEARCH, handleUpdateSearch)]);
}

export default watchGallerySagas;

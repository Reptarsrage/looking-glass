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
import { gallerySelector } from '../selectors/gallerySelectors';
import { refresh } from '../actions/authActions';

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
  const { meta } = action;
  const { moduleId, galleryId } = meta;

  try {
    // resolve service
    let service;
    if (moduleId === 'fs') {
      service = fsService;
    } else {
      service = new LookingGlassService();
    }

    // refresh token (if needed)
    yield put(refresh(moduleId));

    // get data
    const accessToken = yield select(accessTokenSelector, { moduleId });
    const gallery = yield select(gallerySelector);
    const { offset, before, after, searchQuery } = gallery;
    const { data } = yield call(
      service.fetchImages,
      moduleId,
      galleryId,
      accessToken,
      offset,
      before,
      after,
      searchQuery
    );

    yield put({ type: FETCH_GALLERY_SUCCESS, payload: data, meta: { moduleId, galleryId } });
  } catch (e) {
    console.error(e, 'Error fetching images');
    yield put({ type: FETCH_GALLERY_ERROR, payload: e, meta: { moduleId, galleryId } });
  }
}

function* watchGallerySagas() {
  yield all([takeLatest(FETCH_GALLERY, handleFetchImages), takeLatest(UPDATE_SEARCH, handleUpdateSearch)]);
}

export default watchGallerySagas;

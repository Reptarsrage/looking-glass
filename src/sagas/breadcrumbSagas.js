import { takeEvery, select, put } from 'redux-saga/effects';

import { SET_CURRENT_GALLERY, UPDATE_BREADCRUMB } from '../actions/types';
import { galleryByIdSelector } from '../selectors/gallerySelectors';

function* handleGalleryChange(action) {
  const { payload } = action;
  const { galleryId, moduleId } = payload;
  const gallery = yield select(galleryByIdSelector, { galleryId, moduleId });

  if (gallery.id) {
    yield put({ type: UPDATE_BREADCRUMB, payload: gallery });
  }
}

function* watchModuleSagas() {
  yield takeEvery(SET_CURRENT_GALLERY, handleGalleryChange);
}

export default watchModuleSagas;

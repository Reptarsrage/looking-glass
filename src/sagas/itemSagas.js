import { put, select, takeLatest } from 'redux-saga/effects';

import { itemFullScreen } from '../actions/itemActions';
import { navigateToGallery } from '../actions/navigationActions';
import { itemByIdSelector } from '../selectors/itemSelectors';
import { moduleIdSelector, galleryIdSelector } from '../selectors/appSelectors';

import { ITEM_CLICK } from '../actions/types';

function* handleItemClick(action) {
  const { payload } = action;
  const itemId = payload;

  const item = yield select(itemByIdSelector, { itemId });
  const { isGallery, title } = item;

  if (isGallery) {
    const moduleId = yield select(moduleIdSelector);
    const galleryId = yield select(galleryIdSelector);
    yield put(navigateToGallery(moduleId, galleryId, title));
  } else {
    yield put(itemFullScreen(itemId));
  }
}

function* watchItemSagas() {
  yield takeLatest(ITEM_CLICK, handleItemClick);
}

export default watchItemSagas;

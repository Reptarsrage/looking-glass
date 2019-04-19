import { all, fork } from 'redux-saga/effects';

import watchGallerySagas from './gallerySagas';

export default function* rootSaga() {
  yield all([fork(watchGallerySagas)]);
}

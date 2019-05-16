import { all, fork } from 'redux-saga/effects';

import watchGallerySagas from './gallerySagas';
import watchAuthSagas from './authSagas';

export default function* rootSaga() {
  yield all([fork(watchGallerySagas), fork(watchAuthSagas)]);
}

import { all, fork } from 'redux-saga/effects';

import watchGallerySagas from './gallerySagas';
import watchAuthSagas from './authSagas';
import watchModuleSagas from './moduleSagas';
import navigationSagas from './navigationSagas';
import filterSagas from './filterSagas';
import itemSagas from './itemSagas';

export default function* rootSaga() {
  yield all([
    fork(watchGallerySagas),
    fork(watchAuthSagas),
    fork(watchModuleSagas),
    fork(navigationSagas),
    fork(filterSagas),
    fork(itemSagas),
  ]);
}

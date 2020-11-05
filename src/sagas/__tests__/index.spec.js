import { fork } from 'redux-saga/effects'

import watchGallerySagas from '../gallerySagas'
import watchAuthSagas from '../authSagas'
import watchModuleSagas from '../moduleSagas'
import watchFilterSagas from '../filterSagas'
import rootSaga from '../index'

it('should fork all sagas', async () => {
  const gen = rootSaga()
  const { type, payload } = gen.next().value

  // assert
  expect(type).toEqual('ALL')
  expect(payload).toContainEqual(fork(watchModuleSagas))
  expect(payload).toContainEqual(fork(watchFilterSagas))
  expect(payload).toContainEqual(fork(watchAuthSagas))
  expect(payload).toContainEqual(fork(watchGallerySagas))
})

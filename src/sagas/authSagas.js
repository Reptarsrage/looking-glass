import { put, call, takeEvery, select } from 'redux-saga/effects'
import moment from 'moment'

import lookingGlassService from 'services/lookingGlassService'
import { moduleSiteIdSelector } from 'selectors/moduleSelectors'
import { expiresSelector, refreshTokenSelector } from 'selectors/authSelectors'
import { loginSuccess, loginFailure, refreshSuccess, refreshFailure } from 'actions/authActions'
import { LOGIN } from 'actions/types'
import logger from '../logger'

/**
 * helper to check if an access token needs refreshing
 * @param {string|number} moduleId Module ID
 */
function* needsRefresh(moduleId) {
  // select info from the redux store
  const expires = yield select(expiresSelector, { moduleId })
  const refreshToken = yield select(refreshTokenSelector, { moduleId })

  // check if module supports refreshing
  if (!refreshToken || expires <= 0) {
    return false
  }

  // compare current time with the expiration date
  const expireDate = moment(expires)
  const currentDate = moment()
  return currentDate.isSameOrAfter(expireDate)
}

/**
 * saga to handle refreshing auth tokens
 * @param {string|number} moduleId Module ID
 */
export function* handleRefresh(moduleId) {
  // check if we need to refresh the token
  const needToRefresh = yield call(needsRefresh, moduleId)
  if (!needToRefresh) {
    return
  }

  try {
    // select info from the redux store
    const moduleSiteId = yield select(moduleSiteIdSelector, { moduleId })
    const refreshToken = yield select(refreshTokenSelector, { moduleId })

    // make request
    const { data } = yield call(lookingGlassService.refresh, moduleSiteId, refreshToken)

    // put info into the store
    yield put(refreshSuccess(moduleId, data))
  } catch (error) {
    // encountered an error
    logger.error(error, 'Error refreshing authentication token')
    yield put(refreshFailure(moduleId, error))
  }
}

/**
 * saga to handle user authentication
 * @param {*} action Dispatched action
 */
export function* handleLogin(action) {
  const { payload, meta } = action
  const moduleId = meta

  try {
    // select info from the redux store
    const moduleSiteId = yield select(moduleSiteIdSelector, { moduleId })

    // make request
    const { data } = yield call(lookingGlassService.login, moduleSiteId, payload)

    // put info into the store
    yield put(loginSuccess(moduleId, data))
  } catch (error) {
    // encountered an error
    logger.error(error, 'Error logging in')
    yield put(loginFailure(moduleId, error))
  }
}

export default function* watchAuthSagas() {
  yield takeEvery(LOGIN, handleLogin)
}

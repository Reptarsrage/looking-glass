import { put, call, takeLatest, all, select } from 'redux-saga/effects'
import moment from 'moment'

import LookingGlassService from '../services/lookingGlassService'
import { moduleByIdSelector } from '../selectors/moduleSelectors'
import { expiresSelector, refreshTokenSelector } from '../selectors/authSelectors'
import { LOGIN, FETCH_OATH_URL, AUTHORIZE } from '../actions/types'
import {
  loginSuccess,
  loginFailure,
  fetchOathUrlSuccess,
  fetchOathUrlFailure,
  refreshSuccess,
  refreshFailure,
  authorizeSuccess,
  authorizeFailure,
} from '../actions/authActions'

function* needsRefresh(moduleId) {
  const expires = yield select(expiresSelector, { moduleId })
  const refreshToken = yield select(refreshTokenSelector, { moduleId })
  if (!refreshToken || expires <= 0) {
    return false // module does not support refreshing
  }

  const expireDate = moment(expires)
  const currentDate = moment()
  return currentDate.isSameOrAfter(expireDate)
}

export function* handleRefresh(action) {
  const { meta } = action
  const moduleId = meta
  const needToRefresh = yield call(needsRefresh, moduleId)
  if (needToRefresh) {
    try {
      const { siteId } = yield select(moduleByIdSelector, { moduleId })
      const refreshToken = yield select(refreshTokenSelector, { moduleId })
      const lookingGlassService = new LookingGlassService()
      const { data } = yield call(lookingGlassService.refresh, siteId, refreshToken)
      yield put(refreshSuccess(moduleId, data))
    } catch (error) {
      console.error(error, 'Error refreshing authentication token')
      yield put(refreshFailure(moduleId, error))
    }
  }
}

function* handleAuthorize(action) {
  const { payload, meta } = action
  const moduleId = meta

  try {
    const lookingGlassService = new LookingGlassService()
    const { siteId } = yield select(moduleByIdSelector, { moduleId })
    const { data } = yield call(lookingGlassService.authorize, siteId, payload)
    yield put(authorizeSuccess(moduleId, data))
  } catch (error) {
    console.error(error, 'Error retrieving authentication token')
    yield put(authorizeFailure(moduleId, error))
  }
}

function* handleFetchOauthURL(action) {
  const { meta } = action
  const moduleId = meta

  try {
    const lookingGlassService = new LookingGlassService()
    const { siteId } = yield select(moduleByIdSelector, { moduleId })
    const { data } = yield call(lookingGlassService.getOauthURL, siteId)
    yield put(fetchOathUrlSuccess(moduleId, data))
  } catch (e) {
    console.error(e, 'Error fetching OAuth info')
    yield put(fetchOathUrlFailure(moduleId, e))
  }
}

function* handleLogin(action) {
  const { payload, meta } = action
  const moduleId = meta

  try {
    const lookingGlassService = new LookingGlassService()
    const { siteId } = yield select(moduleByIdSelector, { moduleId })
    const { data } = yield call(lookingGlassService.login, siteId, payload)
    yield put(loginSuccess(moduleId, data))
  } catch (e) {
    console.error(e, 'Error logging in')
    yield put(loginFailure(moduleId, e))
  }
}

function* watchAuthSagas() {
  yield all([
    takeLatest(LOGIN, handleLogin),
    takeLatest(FETCH_OATH_URL, handleFetchOauthURL),
    takeLatest(AUTHORIZE, handleAuthorize),
  ])
}

export default watchAuthSagas

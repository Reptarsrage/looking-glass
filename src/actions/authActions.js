import { LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, REFRESH_SUCCESS, REFRESH_FAILURE } from './types'

/**
 * Authenticate using OAuth 2.0
 * @param {string|number} moduleId Module ID
 * @param {string} code OAuth 2.0 authorization code
 */
export const authorize = (moduleId, code) => ({
  type: LOGIN,
  payload: {
    code,
  },
  meta: moduleId,
})

/**
 * Authenticate using implicit or basic auth
 * @param {string|number} moduleId Module ID
 * @param {string} username User name
 * @param {string} password Password
 */
export const login = (moduleId, username, password) => ({
  type: LOGIN,
  payload: {
    username,
    password,
  },
  meta: moduleId,
})

/**
 * Successfully authenticated
 * @param {string|number} moduleId Module ID
 * @param {*} authInfo Response data
 */
export const loginSuccess = (moduleId, authInfo) => ({
  type: LOGIN_SUCCESS,
  payload: authInfo,
  meta: moduleId,
})

/**
 * Failed to authenticate
 * @param {string|number} moduleId Module ID
 * @param {Error} error Error data
 */
export const loginFailure = (moduleId, error) => ({
  type: LOGIN_FAILURE,
  payload: error,
  meta: moduleId,
})

/**
 * Successfully refreshed auth token
 * @param {string|number} moduleId Module ID
 * @param {*} authInfo Response data
 */
export const refreshSuccess = (moduleId, authInfo) => ({
  type: REFRESH_SUCCESS,
  payload: authInfo,
  meta: moduleId,
})

/**
 * Failed to refresh auth token
 * @param {string|number} moduleId Module ID
 * @param {Error} error Error data
 */
export const refreshFailure = (moduleId, error) => ({
  type: REFRESH_FAILURE,
  payload: error,
  meta: moduleId,
})

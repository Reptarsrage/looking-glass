import moment from 'moment'
import { takeEvery } from 'redux-saga/effects'

import { LOGIN } from 'actions/types'
import lookingGlassService from 'services/lookingGlassService'
import { login, loginFailure, loginSuccess, refreshSuccess, refreshFailure, authorize } from 'actions/authActions'
import watchAuthSagas, { handleLogin, handleRefresh } from '../authSagas'
import { recordSaga } from './sagaTestHelpers'
import logger from '../../logger'

jest.mock('services/lookingGlassService')

it('should watch for all actions', async () => {
  const gen = watchAuthSagas()
  expect(gen.next().value).toEqual(takeEvery(LOGIN, handleLogin))
})

describe('handleRefresh', () => {
  it('should run successfully', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedData = 'EXPECTED DATA'
    const expectedRefreshToken = 'EXPECTED REFRESH TOKEN'
    const initialState = {
      auth: {
        byId: {
          [expectedModuleId]: {
            expires: moment().toISOString(),
            refreshToken: expectedRefreshToken,
          },
        },
      },
      module: {
        byId: {
          [expectedModuleId]: {
            siteId: expectedModuleSiteId,
          },
        },
      },
    }

    lookingGlassService.refresh.mockImplementation(() => Promise.resolve({ data: expectedData }))

    // act
    const dispatched = await recordSaga(handleRefresh, expectedModuleId, initialState)

    // assert
    expect(dispatched).toContainEqual(refreshSuccess(expectedModuleId, expectedData))
    expect(lookingGlassService.refresh).toHaveBeenCalledWith(expectedModuleSiteId, expectedRefreshToken)
  })

  it('should not need refresh', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedRefreshToken = 'EXPECTED REFRESH TOKEN'
    const initialState = {
      auth: {
        byId: {
          [expectedModuleId]: {
            expires: moment().add(1, 'minute').toISOString(),
            refreshToken: expectedRefreshToken,
          },
        },
      },
    }

    // act
    const dispatched = await recordSaga(handleRefresh, expectedModuleId, initialState)

    // assert
    expect(dispatched).toHaveLength(0)
    expect(lookingGlassService.refresh).not.toHaveBeenCalled()
  })

  it('should not support refresh', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const initialState = {
      auth: {
        allIds: [expectedModuleId],
        byId: {
          [expectedModuleId]: {
            accessToken: '',
            refreshToken: null,
          },
        },
      },
    }

    // act
    const dispatched = await recordSaga(handleRefresh, expectedModuleId, initialState)

    // assert
    expect(dispatched).toHaveLength(0)
    expect(lookingGlassService.refresh).not.toHaveBeenCalled()
  })

  it('should fail', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedError = 'EXPECTED ERROR'
    const expectedRefreshToken = 'EXPECTED REFRESH TOKEN'
    const initialState = {
      auth: {
        byId: {
          [expectedModuleId]: {
            expires: moment().toISOString(),
            refreshToken: expectedRefreshToken,
          },
        },
      },
      module: {
        byId: {
          [expectedModuleId]: {
            siteId: expectedModuleSiteId,
          },
        },
      },
    }

    logger.error = jest.fn()
    lookingGlassService.refresh.mockImplementation(() => Promise.reject(expectedError))

    // act
    const dispatched = await recordSaga(handleRefresh, expectedModuleId, initialState)

    // assert
    expect(dispatched).toContainEqual(refreshFailure(expectedModuleId, expectedError))
    expect(lookingGlassService.refresh).toHaveBeenCalledWith(expectedModuleSiteId, expectedRefreshToken)
    expect(logger.error).toHaveBeenCalled()
  })
})

describe('handleLogin', () => {
  it('should run successfully', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedUsername = 'EXPECTED USERNAME'
    const expectedPassword = 'EXPECTED PASSWORD'
    const expectedData = 'EXPECTED DATA'
    const initialAction = login(expectedModuleId, expectedUsername, expectedPassword)
    const initialState = {
      module: {
        byId: {
          [expectedModuleId]: {
            siteId: expectedModuleSiteId,
          },
        },
      },
    }

    lookingGlassService.login.mockImplementation(() => Promise.resolve({ data: expectedData }))

    // act
    const dispatched = await recordSaga(handleLogin, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(loginSuccess(expectedModuleId, expectedData))
    expect(lookingGlassService.login).toHaveBeenCalledWith(expectedModuleSiteId, expectedUsername, expectedPassword)
  })

  it('should fail', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedUsername = 'EXPECTED USERNAME'
    const expectedPassword = 'EXPECTED PASSWORD'
    const expectedError = 'EXPECTED DATA'
    const initialAction = login(expectedModuleId, expectedUsername, expectedPassword)
    const initialState = {
      module: {
        byId: {
          [expectedModuleId]: {
            siteId: expectedModuleSiteId,
          },
        },
      },
    }

    logger.error = jest.fn()
    lookingGlassService.login.mockImplementation(() => Promise.reject(expectedError))

    // act
    const dispatched = await recordSaga(handleLogin, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(loginFailure(expectedModuleId, expectedError))
    expect(logger.error).toHaveBeenCalled()
    expect(lookingGlassService.login).toHaveBeenCalledWith(expectedModuleSiteId, expectedUsername, expectedPassword)
  })

  it('should run successfully using authorize', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedCode = 'EXPECTED CODE'
    const expectedData = 'EXPECTED DATA'
    const initialAction = authorize(expectedModuleId, expectedCode)
    const initialState = {
      module: {
        byId: {
          [expectedModuleId]: {
            siteId: expectedModuleSiteId,
          },
        },
      },
    }

    lookingGlassService.authorize.mockImplementation(() => Promise.resolve({ data: expectedData }))

    // act
    const dispatched = await recordSaga(handleLogin, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(loginSuccess(expectedModuleId, expectedData))
    expect(lookingGlassService.authorize).toHaveBeenCalledWith(expectedModuleSiteId, expectedCode)
  })

  it('should fail using authorize', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedCode = 'EXPECTED CODE'
    const expectedError = 'EXPECTED DATA'
    const initialAction = authorize(expectedModuleId, expectedCode)
    const initialState = {
      module: {
        byId: {
          [expectedModuleId]: {
            siteId: expectedModuleSiteId,
          },
        },
      },
    }

    logger.error = jest.fn()
    lookingGlassService.authorize.mockImplementation(() => Promise.reject(expectedError))

    // act
    const dispatched = await recordSaga(handleLogin, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(loginFailure(expectedModuleId, expectedError))
    expect(logger.error).toHaveBeenCalled()
    expect(lookingGlassService.authorize).toHaveBeenCalledWith(expectedModuleSiteId, expectedCode)
  })
})

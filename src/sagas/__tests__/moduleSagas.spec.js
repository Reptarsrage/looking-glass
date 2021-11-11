import { takeEvery } from 'redux-saga/effects'

import lookingGlassService from 'services/lookingGlassService'
import { fetchModules, fetchModulesSuccess, fetchModulesFailure } from 'actions/moduleActions'
import { FETCH_MODULES } from 'actions/types'
import watchModuleSagas, { handleFetchModules } from '../moduleSagas'
import { recordSaga } from './sagaTestHelpers'
import logger from '../../logger'

jest.mock('services/lookingGlassService')
jest.mock('../../fileSystemModule', () => 'EXPECTED FS MODULE')

it('should watch for all actions', async () => {
  const gen = watchModuleSagas()
  expect(gen.next().value).toEqual(takeEvery(FETCH_MODULES, handleFetchModules))
})

describe('handleFetchModules', () => {
  it('should run successfully', async () => {
    // arrange
    const expectedData = ['EXPECTED DATA']

    lookingGlassService.fetchModules.mockImplementation(() => Promise.resolve({ data: expectedData }))

    // act
    const dispatched = await recordSaga(handleFetchModules, fetchModules())

    // assert
    expect(dispatched).toContainEqual(fetchModulesSuccess([...expectedData, 'EXPECTED FS MODULE']))
    expect(lookingGlassService.fetchModules).toHaveBeenCalled()
  })

  it('should fail', async () => {
    // arrange
    const expectedError = 'EXPECTED ERROR'

    logger.error = jest.fn()
    lookingGlassService.fetchModules.mockImplementation(() => Promise.reject(expectedError))

    // act
    const dispatched = await recordSaga(handleFetchModules, fetchModules())

    // assert
    expect(dispatched).toContainEqual(fetchModulesFailure(expectedError))
    expect(logger.error).toHaveBeenCalled()
    expect(lookingGlassService.fetchModules).toHaveBeenCalled()
  })
})

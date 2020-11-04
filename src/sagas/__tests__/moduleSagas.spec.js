import lookingGlassService from '../../services/lookingGlassService'
import * as moduleActions from '../../actions/moduleActions'

import { handleFetchModules } from '../moduleSagas'
import { recordSaga } from './sagaTestHelpers'

jest.mock('../../services/lookingGlassService')

describe('handleFetchModules', () => {
  it('should run successfully', async () => {
    // arrange
    const expectedData = 'EXPECTED DATA'

    lookingGlassService.fetchModules.mockImplementation(() => Promise.resolve({ data: expectedData }))

    // act
    const dispatched = await recordSaga(handleFetchModules)

    // assert
    expect(dispatched).toContainEqual(moduleActions.fetchModulesSuccess(expectedData))
    expect(lookingGlassService.fetchModules).toHaveBeenCalled()
  })

  it('should fail', async () => {
    // arrange
    const expectedError = 'EXPECTED ERROR'

    console.error = jest.fn()
    lookingGlassService.fetchModules.mockImplementation(() => Promise.reject(expectedError))

    // act
    const dispatched = await recordSaga(handleFetchModules)

    // assert
    expect(dispatched).toContainEqual(moduleActions.fetchModulesFailure(expectedError))
    expect(console.error).toHaveBeenCalled()
    expect(lookingGlassService.fetchModules).toHaveBeenCalled()
  })
})

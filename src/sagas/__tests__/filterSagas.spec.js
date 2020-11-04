import lookingGlassService from '../../services/lookingGlassService'
import * as filterActions from '../../actions/filterActions'
import { handleFetchItemFilters, handleFetchFilters } from '../filterSagas'
import { recordSaga } from './sagaTestHelpers'

jest.mock('../../services/lookingGlassService')

describe('handleFetchItemFilters', () => {
  it('should run successfully', async () => {
    // arrange
    const expectedData = 'EXPECTED DATA'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedItemId = 'EXPECTED ITEM ID'
    const expectedItemSiteId = 'EXPECTED ITEM SITE ID'
    const initialAction = filterActions.fetchItemFilters(expectedModuleId, expectedItemId)
    const initialState = {
      item: {
        byId: {
          [expectedItemId]: {
            siteId: expectedItemSiteId,
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

    lookingGlassService.fetchItemFilters.mockImplementation(() => Promise.resolve({ data: expectedData }))

    // act
    const dispatched = await recordSaga(handleFetchItemFilters, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(
      filterActions.fetchItemFiltersSuccess(expectedModuleId, expectedItemId, expectedData)
    )
    expect(lookingGlassService.fetchItemFilters).toHaveBeenCalledWith(expectedModuleSiteId, expectedItemSiteId, '')
  })

  it('should fail', async () => {
    // arrange
    const expectedError = 'EXPECTED ERROR'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedItemId = 'EXPECTED ITEM ID'
    const expectedItemSiteId = 'EXPECTED ITEM SITE ID'
    const initialAction = filterActions.fetchItemFilters(expectedModuleId, expectedItemId)
    const initialState = {
      item: {
        byId: {
          [expectedItemId]: {
            siteId: expectedItemSiteId,
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

    console.error = jest.fn()
    lookingGlassService.fetchItemFilters.mockImplementation(() => Promise.reject(expectedError))

    // act
    const dispatched = await recordSaga(handleFetchItemFilters, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(
      filterActions.fetchItemFiltersError(expectedModuleId, expectedItemId, expectedError)
    )
    expect(lookingGlassService.fetchItemFilters).toHaveBeenCalledWith(expectedModuleSiteId, expectedItemSiteId, '')
    expect(console.error).toHaveBeenCalled()
  })
})

describe('handleFetchFilters', () => {
  it('should run successfully', async () => {
    // arrange
    const expectedData = 'EXPECTED DATA'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedFilterSectionId = 'EXPECTED FILTER SECTION ID'
    const expectedFilterSectionSiteId = 'EXPECTED FILTER SECTION SITE ID'
    const initialAction = filterActions.fetchFilters(expectedFilterSectionId)
    const initialState = {
      filterSection: {
        byId: {
          [expectedFilterSectionId]: {
            siteId: expectedFilterSectionSiteId,
            moduleId: expectedModuleId,
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

    lookingGlassService.fetchFilters.mockImplementation(() => Promise.resolve({ data: expectedData }))

    // act
    const dispatched = await recordSaga(handleFetchFilters, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(filterActions.fetchFiltersSuccess(expectedFilterSectionId, expectedData))
    expect(lookingGlassService.fetchFilters).toHaveBeenCalledWith(expectedModuleSiteId, expectedFilterSectionSiteId, '')
  })

  it('should fail', async () => {
    // arrange
    const expectedError = 'EXPECTED ERROR'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedFilterSectionId = 'EXPECTED FILTER SECTION ID'
    const expectedFilterSectionSiteId = 'EXPECTED FILTER SECTION SITE ID'
    const initialAction = filterActions.fetchFilters(expectedFilterSectionId)
    const initialState = {
      filterSection: {
        byId: {
          [expectedFilterSectionId]: {
            siteId: expectedFilterSectionSiteId,
            moduleId: expectedModuleId,
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

    console.error = jest.fn()
    lookingGlassService.fetchFilters.mockImplementation(() => Promise.reject(expectedError))

    // act
    const dispatched = await recordSaga(handleFetchFilters, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(filterActions.fetchFiltersError(expectedFilterSectionId, expectedError))
    expect(lookingGlassService.fetchFilters).toHaveBeenCalledWith(expectedModuleSiteId, expectedFilterSectionSiteId, '')
    expect(console.error).toHaveBeenCalled()
  })
})

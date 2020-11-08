import { takeEvery } from 'redux-saga/effects'

import lookingGlassService from 'services/lookingGlassService'
import {
  fetchFilters,
  fetchItemFilters,
  fetchFiltersSuccess,
  fetchFiltersError,
  fetchItemFiltersError,
  fetchItemFiltersSuccess,
} from 'actions/filterActions'
import { FETCH_FILTERS, FETCH_ITEM_FILTERS } from 'actions/types'
import watchFilterSagas, { handleFetchItemFilters, handleFetchFilters } from '../filterSagas'
import { recordSaga } from './sagaTestHelpers'
import logger from '../../logger'

jest.mock('services/lookingGlassService')

it('should watch for all actions', async () => {
  // arrange & act
  const gen = watchFilterSagas()
  const { type, payload } = gen.next().value

  // assert
  expect(type).toEqual('ALL')
  expect(payload).toContainEqual(takeEvery(FETCH_FILTERS, handleFetchFilters))
  expect(payload).toContainEqual(takeEvery(FETCH_ITEM_FILTERS, handleFetchItemFilters))
})

describe('handleFetchItemFilters', () => {
  it('should run successfully', async () => {
    // arrange
    const expectedData = 'EXPECTED DATA'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedItemId = 'EXPECTED ITEM ID'
    const expectedItemSiteId = 'EXPECTED ITEM SITE ID'
    const initialAction = fetchItemFilters(expectedModuleId, expectedItemId)
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
    expect(dispatched).toContainEqual(fetchItemFiltersSuccess(expectedModuleId, expectedItemId, expectedData))
    expect(lookingGlassService.fetchItemFilters).toHaveBeenCalledWith(expectedModuleSiteId, expectedItemSiteId, '')
  })

  it('should fail', async () => {
    // arrange
    const expectedError = 'EXPECTED ERROR'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedItemId = 'EXPECTED ITEM ID'
    const expectedItemSiteId = 'EXPECTED ITEM SITE ID'
    const initialAction = fetchItemFilters(expectedModuleId, expectedItemId)
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

    logger.error = jest.fn()
    lookingGlassService.fetchItemFilters.mockImplementation(() => Promise.reject(expectedError))

    // act
    const dispatched = await recordSaga(handleFetchItemFilters, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(fetchItemFiltersError(expectedModuleId, expectedItemId, expectedError))
    expect(lookingGlassService.fetchItemFilters).toHaveBeenCalledWith(expectedModuleSiteId, expectedItemSiteId, '')
    expect(logger.error).toHaveBeenCalled()
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
    const initialAction = fetchFilters(expectedFilterSectionId)
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
    expect(dispatched).toContainEqual(fetchFiltersSuccess(expectedFilterSectionId, expectedData))
    expect(lookingGlassService.fetchFilters).toHaveBeenCalledWith(expectedModuleSiteId, expectedFilterSectionSiteId, '')
  })

  it('should fail', async () => {
    // arrange
    const expectedError = 'EXPECTED ERROR'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedModuleSiteId = 'EXPECTED MODULE SITE ID'
    const expectedFilterSectionId = 'EXPECTED FILTER SECTION ID'
    const expectedFilterSectionSiteId = 'EXPECTED FILTER SECTION SITE ID'
    const initialAction = fetchFilters(expectedFilterSectionId)
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

    logger.error = jest.fn()
    lookingGlassService.fetchFilters.mockImplementation(() => Promise.reject(expectedError))

    // act
    const dispatched = await recordSaga(handleFetchFilters, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(fetchFiltersError(expectedFilterSectionId, expectedError))
    expect(lookingGlassService.fetchFilters).toHaveBeenCalledWith(expectedModuleSiteId, expectedFilterSectionSiteId, '')
    expect(logger.error).toHaveBeenCalled()
  })
})

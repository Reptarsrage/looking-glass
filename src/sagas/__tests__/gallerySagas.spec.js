import delayP from '@redux-saga/delay-p'
import { put, call, select, cancelled, takeEvery, takeLatest } from 'redux-saga/effects'

import lookingGlassService from 'services/lookingGlassService'
import fileSystemService from 'services/fileSystemService'
import * as galleryActions from 'actions/galleryActions'
import {
  gallerySiteIdSelector,
  galleryModuleIdSelector,
  currentSortSelector,
  currentFilterSelector,
  currentSearchQuerySelector,
  galleryAfterSelector,
  galleryOffsetSelector,
} from 'selectors/gallerySelectors'
import { moduleSiteIdSelector, defaultGalleryIdSelector } from 'selectors/moduleSelectors'
import { valueSiteIdSelector, defaultSortValueSelector } from 'selectors/sortSelectors'
import { filterSiteIdSelector } from 'selectors/filterSelectors'
import { accessTokenSelector } from 'selectors/authSelectors'
import { FETCH_GALLERY, FILTER_CHANGE, SORT_CHANGE, SEARCH_CHANGE } from 'actions/types'
import { FILE_SYSTEM_MODULE_ID } from 'reducers/constants'
import watchGallerySagas, {
  handleSortChange,
  handleFilterChange,
  handleSearchChange,
  handleFetchGallery,
} from '../gallerySagas'
import { handleRefresh } from '../authSagas'
import { recordSaga } from './sagaTestHelpers'

jest.mock('services/lookingGlassService')
jest.mock('services/fileSystemService')

it('should watch for all actions', async () => {
  // arrange & act
  const gen = watchGallerySagas()
  const { type, payload } = gen.next().value

  // assert
  expect(type).toEqual('ALL')

  expect(payload).toContainEqual(takeEvery(FETCH_GALLERY, handleFetchGallery))
  expect(payload).toContainEqual(takeLatest(SEARCH_CHANGE, handleSearchChange))
  expect(payload).toContainEqual(takeEvery(SORT_CHANGE, handleSortChange))
  expect(payload).toContainEqual(takeEvery(FILTER_CHANGE, handleFilterChange))
})

describe('handleSortChange', () => {
  it('when given different values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedSortValueId = 'EXPECTED SORT VALUE ID'
    const initialAction = galleryActions.sortChange(expectedGalleryId, expectedSortValueId)
    const initialState = {
      gallery: {
        byId: {
          [expectedGalleryId]: {
            currentSort: 'NOT EXPECTED',
          },
        },
      },
    }

    // act
    const dispatched = await recordSaga(handleSortChange, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(galleryActions.clearGallery(expectedGalleryId))
    expect(dispatched).toContainEqual(galleryActions.updateSort(expectedGalleryId, expectedSortValueId))
    expect(dispatched).toContainEqual(galleryActions.fetchGallery(expectedGalleryId))
  })

  it('when given same values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedSortValueId = 'EXPECTED SORT VALUE ID'
    const initialAction = galleryActions.sortChange(expectedGalleryId, expectedSortValueId)
    const initialState = {
      gallery: {
        byId: {
          [expectedGalleryId]: {
            currentSort: expectedSortValueId,
          },
        },
      },
    }

    // act
    const dispatched = await recordSaga(handleSortChange, initialAction, initialState)

    // assert
    expect(dispatched).toHaveLength(0)
  })
})

describe('handleFilterChange', () => {
  it('when given different values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const initialAction = galleryActions.filterChange(expectedGalleryId, expectedFilterId)
    const initialState = {
      gallery: {
        byId: {
          [expectedGalleryId]: {
            currentFilter: 'NOT EXPECTED',
          },
        },
      },
    }

    // act
    const dispatched = await recordSaga(handleFilterChange, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(galleryActions.clearGallery(expectedGalleryId))
    expect(dispatched).toContainEqual(galleryActions.updateFilter(expectedGalleryId, expectedFilterId))
    expect(dispatched).toContainEqual(galleryActions.fetchGallery(expectedGalleryId))
  })

  it('when given same values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const initialAction = galleryActions.filterChange(expectedGalleryId, expectedFilterId)
    const initialState = {
      gallery: {
        byId: {
          [expectedGalleryId]: {
            currentFilter: expectedFilterId,
          },
        },
      },
    }

    // act
    const dispatched = await recordSaga(handleFilterChange, initialAction, initialState)

    // assert
    expect(dispatched).toHaveLength(0)
  })
})

describe('handleSearchChange', () => {
  it('when not cancelled and given different values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedSearchQuery = 'EXPECTED SEARCH QUERY'
    const action = galleryActions.searchChange(expectedGalleryId, expectedSearchQuery)

    // act & assert
    const gen = handleSearchChange(action)
    expect(gen.next().value).toEqual(select(currentSearchQuerySelector, { galleryId: expectedGalleryId }))
    expect(gen.next().value).toEqual(put(galleryActions.clearGallery(expectedGalleryId)))
    expect(gen.next().value).toEqual(put(galleryActions.updateSearch(expectedGalleryId, expectedSearchQuery)))
    expect(gen.next().value).toEqual(call(delayP, 500)) // internally, this is how delay is handled by redux-saga
    expect(gen.next().value).toEqual(cancelled())
    expect(gen.next(false /* NOT cancelled */).value).toEqual(put(galleryActions.fetchGallery(expectedGalleryId)))
  })

  it('when cancelled and given different values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedSearchQuery = 'EXPECTED SEARCH QUERY'
    const action = galleryActions.searchChange(expectedGalleryId, expectedSearchQuery)

    // act & assert
    const gen = handleSearchChange(action)
    expect(gen.next().value).toEqual(select(currentSearchQuerySelector, { galleryId: expectedGalleryId }))
    expect(gen.next().value).toEqual(put(galleryActions.clearGallery(expectedGalleryId)))
    expect(gen.next().value).toEqual(put(galleryActions.updateSearch(expectedGalleryId, expectedSearchQuery)))
    expect(gen.next().value).toEqual(call(delayP, 500)) // internally, this is how delay is handled by redux-saga
    expect(gen.next().value).toEqual(cancelled())
    expect(gen.next(true /* cancelled */).value).toBeUndefined()
  })

  it('when given same values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedSearchQuery = 'EXPECTED SEARCH QUERY'
    const action = galleryActions.searchChange(expectedGalleryId, expectedSearchQuery)

    // act & assert
    const gen = handleSearchChange(action)
    expect(gen.next().value).toEqual(select(currentSearchQuerySelector, { galleryId: expectedGalleryId }))
    expect(gen.next(expectedSearchQuery).value).toBeUndefined()
  })
})

describe('handleFetchGallery', () => {
  it('runs successfully', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedSortValueId = 'EXPECTED SORT VALUE ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const expectedData = 'EXPECTED DATA'
    const initialAction = galleryActions.fetchGallery(expectedGalleryId)
    const initialState = {
      sort: {
        allIds: [expectedSortValueId],
        byId: {
          [expectedSortValueId]: {
            siteId: 'EXPECTED SORT VALUE SITE ID',
            moduleId: expectedModuleId,
            availableInSearch: true,
            default: true,
          },
        },
      },
      filter: {
        byId: {
          [expectedFilterId]: {
            siteId: 'EXPECTED FILTER SITE ID',
          },
        },
      },
      module: {
        byId: {
          [expectedModuleId]: {
            id: expectedModuleId,
            siteId: 'EXPECTED MODULE SITE ID',
            defaultGalleryId: 'EXPECTED DEFAULT GALLERY ID',
            defaultSort: 'EXPECTED DEFAULT SORT ID',
          },
        },
      },
      gallery: {
        byId: {
          [expectedGalleryId]: {
            moduleId: expectedModuleId,
            siteId: 'EXPECTED GALLERY SITE ID',
            currentFilter: expectedFilterId,
            currentSort: expectedSortValueId,
            searchQuery: 'EXPECTED SEARCH QUERY',
            after: 'EXPECTED AFTER',
            offset: 0,
          },
        },
      },
    }

    lookingGlassService.fetchItems.mockImplementation(() => Promise.resolve({ data: expectedData }))

    // act
    const dispatched = await recordSaga(handleFetchGallery, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(
      galleryActions.fetchGallerySuccess(expectedModuleId, expectedGalleryId, expectedData)
    )
    expect(lookingGlassService.fetchItems).toHaveBeenCalledWith(
      'EXPECTED MODULE SITE ID',
      'EXPECTED GALLERY SITE ID',
      '',
      0,
      'EXPECTED AFTER',
      'EXPECTED SEARCH QUERY',
      'EXPECTED SORT VALUE SITE ID',
      'EXPECTED FILTER SITE ID'
    )
  })

  it('fails when exception occurs', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedSortValueId = 'EXPECTED SORT VALUE ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const moduleSiteId = 'EXPECTED MODULE SITE ID'
    const gallerySiteId = 'EXPECTED GALLERY SITE ID'
    const accessToken = 'EXPECTED ACCESS TOKEN'
    const offset = 20
    const after = 'EXPECTED AFTER'
    const currentSearchQuery = 'EXPECTED SEARCH QUERY'
    const sortValueSiteId = 'EXPECTED SORT VALUE SITE ID'
    const filterSiteId = 'EXPECTED FILTER SITE ID'
    const expectedError = new Error('TEST EXCEPTION')

    const action = galleryActions.fetchGallery(expectedGalleryId)
    const galleryProps = { galleryId: expectedGalleryId }
    const moduleProps = { moduleId: expectedModuleId }

    console.error = jest.fn()

    // act & assert
    const gen = handleFetchGallery(action)
    expect(gen.next().value).toEqual(select(galleryModuleIdSelector, galleryProps))
    expect(gen.next(expectedModuleId).value).toEqual(select(defaultGalleryIdSelector, moduleProps))
    expect(gen.next('').value).toEqual(select(gallerySiteIdSelector, galleryProps))
    expect(gen.next(gallerySiteId).value).toEqual(select(moduleSiteIdSelector, moduleProps))
    expect(gen.next(moduleSiteId).value).toEqual(select(currentFilterSelector, galleryProps))
    expect(gen.next(expectedFilterId).value).toEqual(select(currentSortSelector, galleryProps))
    expect(gen.next(expectedSortValueId).value).toEqual(select(currentSearchQuerySelector, galleryProps))
    expect(gen.next(currentSearchQuery).value).toEqual(select(galleryAfterSelector, galleryProps))
    expect(gen.next(after).value).toEqual(select(galleryOffsetSelector, galleryProps))
    expect(gen.next(offset).value).toEqual(select(defaultSortValueSelector, moduleProps))
    expect(gen.next('').value).toEqual(select(valueSiteIdSelector, { valueId: expectedSortValueId }))
    expect(gen.next(sortValueSiteId).value).toEqual(select(filterSiteIdSelector, { filterId: expectedFilterId }))
    expect(gen.next(filterSiteId).value).toEqual(call(handleRefresh, expectedModuleId))
    expect(gen.next().value).toEqual(select(accessTokenSelector, moduleProps))
    expect(gen.next(accessToken).value).toEqual(
      call(
        lookingGlassService.fetchItems,
        moduleSiteId,
        gallerySiteId,
        accessToken,
        offset,
        after,
        currentSearchQuery,
        sortValueSiteId,
        filterSiteId
      )
    )

    expect(gen.throw(expectedError).value).toEqual(
      put(galleryActions.fetchGalleryFailure(expectedGalleryId, expectedError))
    )
    expect(gen.next().value).toBeUndefined()
    expect(console.error).toHaveBeenCalled()
  })

  it('uses default gallery', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedSortValueId = 'EXPECTED SORT VALUE ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const moduleSiteId = 'EXPECTED MODULE SITE ID'
    const gallerySiteId = 'EXPECTED GALLERY SITE ID'
    const accessToken = 'EXPECTED ACCESS TOKEN'
    const offset = 20
    const after = 'EXPECTED AFTER'
    const currentSearchQuery = 'EXPECTED SEARCH QUERY'
    const sortValueSiteId = 'EXPECTED SORT VALUE SITE ID'
    const filterSiteId = 'EXPECTED FILTER SITE ID'
    const expectedData = 'EXPECTED DATA'

    const action = galleryActions.fetchGallery(expectedGalleryId)
    const galleryProps = { galleryId: expectedGalleryId }
    const moduleProps = { moduleId: expectedModuleId }

    console.error = jest.fn()

    // act & assert
    const gen = handleFetchGallery(action)
    expect(gen.next().value).toEqual(select(galleryModuleIdSelector, galleryProps))
    expect(gen.next(expectedModuleId).value).toEqual(select(defaultGalleryIdSelector, moduleProps))
    expect(gen.next(expectedGalleryId).value).toEqual(select(gallerySiteIdSelector, galleryProps))
    expect(gen.next(gallerySiteId).value).toEqual(select(moduleSiteIdSelector, moduleProps))
    expect(gen.next(moduleSiteId).value).toEqual(select(currentFilterSelector, galleryProps))
    expect(gen.next(expectedFilterId).value).toEqual(select(currentSortSelector, galleryProps))
    expect(gen.next(expectedSortValueId).value).toEqual(select(currentSearchQuerySelector, galleryProps))
    expect(gen.next(currentSearchQuery).value).toEqual(select(galleryAfterSelector, galleryProps))
    expect(gen.next(after).value).toEqual(select(galleryOffsetSelector, galleryProps))
    expect(gen.next(offset).value).toEqual(select(defaultSortValueSelector, moduleProps))
    expect(gen.next('').value).toEqual(select(valueSiteIdSelector, { valueId: expectedSortValueId }))
    expect(gen.next(sortValueSiteId).value).toEqual(select(filterSiteIdSelector, { filterId: expectedFilterId }))
    expect(gen.next(filterSiteId).value).toEqual(call(handleRefresh, expectedModuleId))
    expect(gen.next().value).toEqual(select(accessTokenSelector, moduleProps))
    expect(gen.next(accessToken).value).toEqual(
      call(
        lookingGlassService.fetchItems,
        moduleSiteId,
        null,
        accessToken,
        offset,
        after,
        currentSearchQuery,
        sortValueSiteId,
        filterSiteId
      )
    )

    expect(gen.next({ data: expectedData }).value).toEqual(
      put(galleryActions.fetchGallerySuccess(expectedModuleId, expectedGalleryId, expectedData))
    )
    expect(gen.next().value).toBeUndefined()
  })

  it('uses default sort', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedSortValueId = null
    const expectedDefaultSortValueId = 'DEFAULT SORT ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const moduleSiteId = 'EXPECTED MODULE SITE ID'
    const gallerySiteId = 'EXPECTED GALLERY SITE ID'
    const accessToken = 'EXPECTED ACCESS TOKEN'
    const offset = 20
    const after = 'EXPECTED AFTER'
    const currentSearchQuery = 'EXPECTED SEARCH QUERY'
    const sortValueSiteId = 'EXPECTED SORT VALUE SITE ID'
    const filterSiteId = 'EXPECTED FILTER SITE ID'
    const expectedData = 'EXPECTED DATA'

    const action = galleryActions.fetchGallery(expectedGalleryId)
    const galleryProps = { galleryId: expectedGalleryId }
    const moduleProps = { moduleId: expectedModuleId }

    console.error = jest.fn()

    // act & assert
    const gen = handleFetchGallery(action)
    expect(gen.next().value).toEqual(select(galleryModuleIdSelector, galleryProps))
    expect(gen.next(expectedModuleId).value).toEqual(select(defaultGalleryIdSelector, moduleProps))
    expect(gen.next('').value).toEqual(select(gallerySiteIdSelector, galleryProps))
    expect(gen.next(gallerySiteId).value).toEqual(select(moduleSiteIdSelector, moduleProps))
    expect(gen.next(moduleSiteId).value).toEqual(select(currentFilterSelector, galleryProps))
    expect(gen.next(expectedFilterId).value).toEqual(select(currentSortSelector, galleryProps))
    expect(gen.next(expectedSortValueId).value).toEqual(select(currentSearchQuerySelector, galleryProps))
    expect(gen.next(currentSearchQuery).value).toEqual(select(galleryAfterSelector, galleryProps))
    expect(gen.next(after).value).toEqual(select(galleryOffsetSelector, galleryProps))
    expect(gen.next(offset).value).toEqual(select(defaultSortValueSelector, moduleProps))
    expect(gen.next(expectedDefaultSortValueId).value).toEqual(
      select(valueSiteIdSelector, { valueId: expectedDefaultSortValueId })
    )
    expect(gen.next(sortValueSiteId).value).toEqual(select(filterSiteIdSelector, { filterId: expectedFilterId }))
    expect(gen.next(filterSiteId).value).toEqual(call(handleRefresh, expectedModuleId))
    expect(gen.next().value).toEqual(select(accessTokenSelector, moduleProps))
    expect(gen.next(accessToken).value).toEqual(
      call(
        lookingGlassService.fetchItems,
        moduleSiteId,
        gallerySiteId,
        accessToken,
        offset,
        after,
        currentSearchQuery,
        sortValueSiteId,
        filterSiteId
      )
    )

    expect(gen.next({ data: expectedData }).value).toEqual(
      put(galleryActions.fetchGallerySuccess(expectedModuleId, expectedGalleryId, expectedData))
    )
    expect(gen.next().value).toBeUndefined()
  })

  it('uses file system service', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedModuleId = FILE_SYSTEM_MODULE_ID
    const expectedSortValueId = 'EXPECTED SORT ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const moduleSiteId = 'EXPECTED MODULE SITE ID'
    const gallerySiteId = 'EXPECTED GALLERY SITE ID'
    const accessToken = 'EXPECTED ACCESS TOKEN'
    const offset = 20
    const after = 'EXPECTED AFTER'
    const currentSearchQuery = 'EXPECTED SEARCH QUERY'
    const sortValueSiteId = 'EXPECTED SORT VALUE SITE ID'
    const filterSiteId = 'EXPECTED FILTER SITE ID'
    const expectedData = 'EXPECTED DATA'

    const action = galleryActions.fetchGallery(expectedGalleryId)
    const galleryProps = { galleryId: expectedGalleryId }
    const moduleProps = { moduleId: expectedModuleId }

    // act & assert
    const gen = handleFetchGallery(action)
    expect(gen.next().value).toEqual(select(galleryModuleIdSelector, galleryProps))
    expect(gen.next(expectedModuleId).value).toEqual(select(defaultGalleryIdSelector, moduleProps))
    expect(gen.next('').value).toEqual(select(gallerySiteIdSelector, galleryProps))
    expect(gen.next(gallerySiteId).value).toEqual(select(moduleSiteIdSelector, moduleProps))
    expect(gen.next(moduleSiteId).value).toEqual(select(currentFilterSelector, galleryProps))
    expect(gen.next(expectedFilterId).value).toEqual(select(currentSortSelector, galleryProps))
    expect(gen.next(expectedSortValueId).value).toEqual(select(currentSearchQuerySelector, galleryProps))
    expect(gen.next(currentSearchQuery).value).toEqual(select(galleryAfterSelector, galleryProps))
    expect(gen.next(after).value).toEqual(select(galleryOffsetSelector, galleryProps))
    expect(gen.next(offset).value).toEqual(select(defaultSortValueSelector, moduleProps))
    expect(gen.next('').value).toEqual(select(valueSiteIdSelector, { valueId: expectedSortValueId }))
    expect(gen.next(sortValueSiteId).value).toEqual(select(filterSiteIdSelector, { filterId: expectedFilterId }))
    expect(gen.next(filterSiteId).value).toEqual(call(handleRefresh, expectedModuleId))
    expect(gen.next().value).toEqual(select(accessTokenSelector, moduleProps))
    expect(gen.next(accessToken).value).toEqual(
      call(
        fileSystemService.fetchItems,
        moduleSiteId,
        gallerySiteId,
        accessToken,
        offset,
        after,
        currentSearchQuery,
        sortValueSiteId,
        filterSiteId
      )
    )

    expect(gen.next({ data: expectedData }).value).toEqual(
      put(galleryActions.fetchGallerySuccess(expectedModuleId, expectedGalleryId, expectedData))
    )
    expect(gen.next().value).toBeUndefined()
  })
})

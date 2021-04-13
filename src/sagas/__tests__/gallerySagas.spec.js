import delayP from '@redux-saga/delay-p'
import { put, call, select, cancelled, takeEvery, takeLatest, all } from 'redux-saga/effects'
import qs from 'querystring'

import lookingGlassService from 'services/lookingGlassService'
import fileSystemService from 'services/fileSystemService'
import {
  sortChange,
  filterAdded,
  filterRemoved,
  searchChange,
  clearGallery,
  fetchGallery,
  fetchGalleryFailure,
  fetchGallerySuccess,
} from 'actions/galleryActions'
import {
  gallerySiteIdSelector,
  galleryModuleIdSelector,
  galleryAfterSelector,
  galleryOffsetSelector,
} from 'selectors/gallerySelectors'
import { moduleSiteIdSelector, moduleDefaultGalleryIdSelector } from 'selectors/moduleSelectors'
import { valueSiteIdSelector, defaultSortValueSelector } from 'selectors/sortSelectors'
import { filterSiteIdSelector, filterSectionIdSelector } from 'selectors/filterSelectors'
import { filterSectionSupportsMultipleSelector, filterSectionSupportsSearchSelector } from 'selectors/filterSectionSelectors'
import { accessTokenSelector } from 'selectors/authSelectors'
import { FETCH_GALLERY, FILTER_ADDED, FILTER_REMOVED, SORT_CHANGE, SEARCH_CHANGE } from 'actions/types'
import { FILE_SYSTEM_MODULE_ID } from 'reducers/constants'
import watchGallerySagas, {
  handleSortChange,
  handleFilterAdded,
  handleFilterRemoved,
  handleSearchChange,
  handleFetchGallery,
} from '../gallerySagas'
import { handleRefresh } from '../authSagas'
import { recordSaga } from './sagaTestHelpers'
import logger from '../../logger'
import { modalClose } from 'actions/modalActions'
import { modalOpenSelector } from 'selectors/modalSelectors'

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
  expect(payload).toContainEqual(takeEvery(FILTER_ADDED, handleFilterAdded))
  expect(payload).toContainEqual(takeEvery(FILTER_REMOVED, handleFilterRemoved))
})

describe('handleSortChange', () => {
  it('when given different values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedSortValueId = 'EXPECTED SORT VALUE ID'
    const mockHistory = { location: { pathname: 'EXPECTED PATH', search: '' }, replace: jest.fn() }
    const initialAction = sortChange(expectedGalleryId, expectedSortValueId, mockHistory)
    const initialState = {}

    // act
    const dispatched = await recordSaga(handleSortChange, initialAction, initialState)

    // assert
    expect(dispatched).toContainEqual(clearGallery(expectedGalleryId))
    expect(mockHistory.replace).toHaveBeenCalledWith(
      `${mockHistory.location.pathname}?${qs.stringify({ search: '', sort: expectedSortValueId })}`
    )
  })

  it('when given same values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedSortValueId = 'EXPECTED SORT VALUE ID'
    const mockHistory = {
      location: {
        pathname: 'EXPECTED PATH',
        search: `?${qs.stringify({ sort: expectedSortValueId })}`,
      },
      push: jest.fn(),
    }

    const initialAction = sortChange(expectedGalleryId, expectedSortValueId, mockHistory)
    const initialState = {}

    // act
    const dispatched = await recordSaga(handleSortChange, initialAction, initialState)

    // assert
    expect(dispatched).toHaveLength(0)
    expect(mockHistory.push).not.toHaveBeenCalled()
  })
})

describe('handleFilterAdded', () => {
  it('when given different values', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedDefaultGalleryId = 'EXPECTED DEFAULT GALLERY ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const expectedFilterSectionId = 'EXPECTED FILTER SECTION ID'
    const supportsMultiple = true
    const supportsSearch = true
    const modalOpen = true
    const mockHistory = { location: { pathname: '/gallery/module/gallery', search: '' }, push: jest.fn() }
    const initialAction = filterAdded(expectedGalleryId, expectedFilterId, mockHistory)

    // act & assert
    const gen = handleFilterAdded(initialAction)
    expect(gen.next(false /* not cancelled */).value).toEqual(select(galleryModuleIdSelector, { galleryId: expectedGalleryId }))
    expect(gen.next(expectedModuleId).value).toEqual(select(moduleDefaultGalleryIdSelector, { moduleId: expectedModuleId }))
    expect(gen.next(expectedDefaultGalleryId).value).toEqual(select(filterSectionIdSelector, { filterId: expectedFilterId }))
    expect(gen.next(expectedFilterSectionId).value).toEqual(select(filterSectionSupportsMultipleSelector, { filterSectionId: expectedFilterSectionId }))
    expect(gen.next(supportsMultiple).value).toEqual(all([]))
    expect(gen.next([]).value).toEqual(select(filterSectionSupportsSearchSelector, { filterSectionId: expectedFilterSectionId }))
    expect(gen.next(supportsSearch).value).toEqual(select(modalOpenSelector))
    expect(gen.next(modalOpen).value).toEqual(put(modalClose()))
    expect(gen.next().value).toEqual(put(clearGallery(expectedGalleryId)))
    expect(gen.next().value).toEqual(put(clearGallery(expectedDefaultGalleryId)))
    expect(gen.next().value).toBeUndefined()
    expect(mockHistory.push).toHaveBeenCalledWith(`/gallery/${expectedModuleId}/${expectedDefaultGalleryId}?${qs.stringify({ search: '', sort: '', filters: [expectedFilterId] })}`)
  })

  it('when given different multiple values', async () => {
   // arrange
   const expectedModuleId = 'EXPECTED MODULE ID'
   const expectedGalleryId = 'EXPECTED GALLERY ID'
   const expectedDefaultGalleryId = 'EXPECTED DEFAULT GALLERY ID'
   const expectedFilterId = 'EXPECTED FILTER ID'
   const other = 'OTHER EXPECTED FILTER ID'
   const expectedFilterSectionId = 'EXPECTED FILTER SECTION ID'
   const supportsMultiple = true
   const supportsSearch = true
   const modalOpen = true
   const mockHistory = { location: { pathname: '/gallery/module/gallery', search: `?filters=${other}` }, push: jest.fn() }
   const initialAction = filterAdded(expectedGalleryId, expectedFilterId, mockHistory)

   // act & assert
   const gen = handleFilterAdded(initialAction)
   expect(gen.next(false /* not cancelled */).value).toEqual(select(galleryModuleIdSelector, { galleryId: expectedGalleryId }))
   expect(gen.next(expectedModuleId).value).toEqual(select(moduleDefaultGalleryIdSelector, { moduleId: expectedModuleId }))
   expect(gen.next(expectedDefaultGalleryId).value).toEqual(select(filterSectionIdSelector, { filterId: expectedFilterId }))
   expect(gen.next(expectedFilterSectionId).value).toEqual(select(filterSectionSupportsMultipleSelector, { filterSectionId: expectedFilterSectionId }))
   gen.next(supportsMultiple) // yield all
   expect(gen.next([other]).value).toEqual(select(filterSectionSupportsSearchSelector, { filterSectionId: expectedFilterSectionId }))
   expect(gen.next(supportsSearch).value).toEqual(select(modalOpenSelector))
   expect(gen.next(modalOpen).value).toEqual(put(modalClose()))
   expect(gen.next().value).toEqual(put(clearGallery(expectedGalleryId)))
   expect(gen.next().value).toEqual(put(clearGallery(expectedDefaultGalleryId)))
   expect(gen.next().value).toBeUndefined()
   expect(mockHistory.push).toHaveBeenCalledWith(`/gallery/${expectedModuleId}/${expectedDefaultGalleryId}?${qs.stringify({ filters: [other, expectedFilterId].join(','), search: '', sort: '' })}`)
 })

  it('when given same values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const mockHistory = {
      location: {
        pathname: 'EXPECTED PATH',
        search: `?${qs.stringify({ filters: expectedFilterId })}`,
      },
      push: jest.fn(),
    }

    const initialAction = filterAdded(expectedGalleryId, expectedFilterId, mockHistory)
    const initialState = {}

    // act
    const dispatched = await recordSaga(handleFilterAdded, initialAction, initialState)

    // assert
    expect(dispatched).toHaveLength(0)
    expect(mockHistory.push).not.toHaveBeenCalled()
  })
})

describe('handleFilterRemoved', () => {
  it('when given existing value', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedDefaultGalleryId = 'EXPECTED DEFAULT GALLERY ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const mockHistory = {
      location: {
        pathname: '/gallery/module/gallery',
        search: `?${qs.stringify({ filters: expectedFilterId })}`,
      },
      push: jest.fn(),
    }

    const initialAction = filterRemoved(expectedGalleryId, expectedFilterId, mockHistory)
    const initialState = {}

    // act & assert
    const gen = handleFilterRemoved(initialAction, initialState)
    expect(gen.next(false /* not cancelled */).value).toEqual(select(galleryModuleIdSelector, { galleryId: expectedGalleryId }))
    expect(gen.next(expectedModuleId).value).toEqual(select(moduleDefaultGalleryIdSelector, { moduleId: expectedModuleId }))
    expect(gen.next(expectedDefaultGalleryId).value).toEqual(put(clearGallery(expectedGalleryId)))
    expect(gen.next().value).toEqual(put(clearGallery(expectedDefaultGalleryId)))
    expect(gen.next().value).toBeUndefined()
    expect(mockHistory.push).toHaveBeenCalledWith(`/gallery/${expectedModuleId}/${expectedDefaultGalleryId}?${qs.stringify({ filters: '', search: '', sort: '' })}`)
  })

  it('when given another value', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedDefaultGalleryId = 'EXPECTED DEFAULT GALLERY ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const mockHistory = {
      location: {
        pathname: '/gallery/module/gallery',
        search: `?${qs.stringify({ filters: ['NOT EXPECTED', expectedFilterId].join(',') })}`,
      },
      push: jest.fn(),
    }

    const initialAction = filterRemoved(expectedGalleryId, expectedFilterId, mockHistory)
    const initialState = {}

    // act & assert
    const gen = handleFilterRemoved(initialAction, initialState)
    expect(gen.next(false /* not cancelled */).value).toEqual(select(galleryModuleIdSelector, { galleryId: expectedGalleryId }))
    expect(gen.next(expectedModuleId).value).toEqual(select(moduleDefaultGalleryIdSelector, { moduleId: expectedModuleId }))
    expect(gen.next(expectedDefaultGalleryId).value).toEqual(put(clearGallery(expectedGalleryId)))
    expect(gen.next().value).toEqual(put(clearGallery(expectedDefaultGalleryId)))
    expect(gen.next().value).toBeUndefined()
    expect(mockHistory.push).toHaveBeenCalledWith(`/gallery/${expectedModuleId}/${expectedDefaultGalleryId}?${qs.stringify({ filters: ['NOT EXPECTED'], search: '', sort: '' })}`)
  })

  it('when given non-existing value', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const mockHistory = {
      location: {
        pathname: 'EXPECTED PATH',
        search: '',
      },
      push: jest.fn(),
    }

    const initialAction = filterRemoved(expectedGalleryId, expectedFilterId, mockHistory)
    const initialState = {}

    // act
    const dispatched = await recordSaga(handleFilterRemoved, initialAction, initialState)

    // assert
    expect(dispatched).toHaveLength(0)
    expect(mockHistory.push).not.toHaveBeenCalled()
  })
})

describe('handleSearchChange', () => {
  it('when switching from search to gallery', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedDefaultGalleryId = 'EXPECTED DEFAULT GALLERY ID'
    const expectedSearchQuery = 'EXPECTED SEARCH QUERY'
    const mockHistory = {
      location: {
        pathname: '/search/module/gallery',
        search: `?${qs.stringify({ search: expectedSearchQuery })}`,
      },
      push: jest.fn(),
    }

    const action = searchChange(expectedGalleryId, '', mockHistory)

    // act & assert
    const gen = handleSearchChange(action)
    expect(gen.next().value).toEqual(call(delayP, 500)) // internally, this is how delay is handled by redux-saga
    expect(gen.next().value).toEqual(cancelled())
    expect(gen.next(false /* not cancelled */).value).toEqual(select(galleryModuleIdSelector, { galleryId: expectedGalleryId }))
    expect(gen.next(expectedModuleId).value).toEqual(select(moduleDefaultGalleryIdSelector, { moduleId: expectedModuleId }))
    expect(gen.next(expectedDefaultGalleryId).value).toEqual(put(clearGallery(expectedGalleryId)))
    expect(gen.next().value).toEqual(put(clearGallery(expectedDefaultGalleryId)))
    expect(gen.next().value).toBeUndefined()
    expect(mockHistory.push).toHaveBeenCalledWith(`/gallery/${expectedModuleId}/${expectedDefaultGalleryId}?${qs.stringify({ search: '', sort: '' })}`)
  })

  it('when cancelled and given different values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedSearchQuery = 'EXPECTED SEARCH QUERY'
    const mockHistory = { location: { pathname: '/search/module/gallery', search: '' }, push: jest.fn() }
    const action = searchChange(expectedGalleryId, expectedSearchQuery, mockHistory)

    // act & assert
    const gen = handleSearchChange(action)
    expect(gen.next().value).toEqual(call(delayP, 500)) // internally, this is how delay is handled by redux-saga
    expect(gen.next().value).toEqual(cancelled())
    expect(gen.next(true /* cancelled */).value).toBeUndefined()
    expect(mockHistory.push).not.toHaveBeenCalled()
  })

  it('when gallery is default', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedDefaultGalleryId = expectedGalleryId
    const expectedSearchQuery = 'EXPECTED SEARCH QUERY'
    const mockHistory = {
      location: {
        pathname: '/search/module/gallery',
        search: `?${qs.stringify({ search: 'NOT EXPECTED' })}`,
      },
      push: jest.fn(),
    }

    const action = searchChange(expectedGalleryId, expectedSearchQuery, mockHistory)

    // act & assert
    const gen = handleSearchChange(action)
    expect(gen.next().value).toEqual(call(delayP, 500)) // internally, this is how delay is handled by redux-saga
    expect(gen.next().value).toEqual(cancelled())
    expect(gen.next(false /* not cancelled */).value).toEqual(select(galleryModuleIdSelector, { galleryId: expectedGalleryId }))
    expect(gen.next(expectedModuleId).value).toEqual(select(moduleDefaultGalleryIdSelector, { moduleId: expectedModuleId }))
    expect(gen.next(expectedDefaultGalleryId).value).toEqual(put(clearGallery(expectedGalleryId)))
    expect(gen.next().value).toBeUndefined()
    expect(mockHistory.push).toHaveBeenCalledWith(`/search/${expectedModuleId}/${expectedDefaultGalleryId}?${qs.stringify({ search: expectedSearchQuery, sort: '' })}`)
  })

  it('when given same values', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedSearchQuery = 'EXPECTED SEARCH QUERY'
    const mockHistory = {
      location: {
        pathname: '/search/module/gallery',
        search: `?${qs.stringify({ search: expectedSearchQuery })}`,
      },
    }

    const action = searchChange(expectedGalleryId, expectedSearchQuery, mockHistory)

    // act & assert
    const gen = handleSearchChange(action)
    expect(gen.next().value).toBeUndefined()
  })

  it('when switches from gallery to search path', async () => {
    // arrange
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedDefaultGalleryId = 'EXPECTED DEFAULT GALLERY ID'
    const expectedSearchQuery = 'EXPECTED SEARCH QUERY'
    const mockHistory = {
      location: {
        pathname: '/gallery/module/gallery',
        search: '',
      },
      push: jest.fn(),
    }

    const action = searchChange(expectedGalleryId, expectedSearchQuery, mockHistory)

    // act & assert
    const gen = handleSearchChange(action)
    expect(gen.next().value).toEqual(call(delayP, 500)) // internally, this is how delay is handled by redux-saga
    expect(gen.next().value).toEqual(cancelled())
    expect(gen.next(false /* not cancelled */).value).toEqual(select(galleryModuleIdSelector, { galleryId: expectedGalleryId }))
    expect(gen.next(expectedModuleId).value).toEqual(select(moduleDefaultGalleryIdSelector, { moduleId: expectedModuleId }))
    expect(gen.next(expectedDefaultGalleryId).value).toEqual(put(clearGallery(expectedGalleryId)))
    expect(gen.next().value).toEqual(put(clearGallery(expectedDefaultGalleryId)))
    expect(gen.next().value).toBeUndefined()
    expect(mockHistory.push).toHaveBeenCalledWith(`/search/${expectedModuleId}/${expectedDefaultGalleryId}?${qs.stringify({ search: expectedSearchQuery, sort: '' })}`)
  })
})

describe('handleFetchGallery', () => {
  it('handleFetchGallery runs successfully', async () => {
    // arrange
    const expectedGalleryId = 'EXPECTED GALLERY ID'
    const expectedModuleId = 'EXPECTED MODULE ID'
    const expectedSortValueId = 'EXPECTED SORT VALUE ID'
    const expectedFilterId = 'EXPECTED FILTER ID'
    const expectedData = 'EXPECTED DATA'
    const expectedSearch = 'EXPECTED SEARCH QUERY'
    const initialAction = fetchGallery(expectedGalleryId, [expectedFilterId], expectedSortValueId, expectedSearch)
    const initialState = {
      auth: {
        allIds: [expectedModuleId],
        byId: {
          [expectedModuleId]: {
            accessToken: 'EXPECTED ACCESS TOKEN',
            refreshToken: null,
          },
        },
      },
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
        allIds: [expectedModuleId],
        byId: {
          [expectedModuleId]: {
            id: expectedModuleId,
            siteId: 'EXPECTED MODULE SITE ID',
            defaultGalleryId: 'EXPECTED DEFAULT GALLERY ID',
          },
        },
      },
      gallery: {
        byId: {
          [expectedGalleryId]: {
            moduleId: expectedModuleId,
            siteId: 'EXPECTED GALLERY SITE ID',
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
    expect(dispatched).toContainEqual(fetchGallerySuccess(expectedModuleId, expectedGalleryId, expectedData))
    expect(lookingGlassService.fetchItems).toHaveBeenCalledWith(
      'EXPECTED MODULE SITE ID',
      'EXPECTED GALLERY SITE ID',
      'EXPECTED ACCESS TOKEN',
      0,
      'EXPECTED AFTER',
      'EXPECTED SEARCH QUERY',
      'EXPECTED SORT VALUE SITE ID',
      ['EXPECTED FILTER SITE ID']
    )
  })

  it('fails when exception occurs', async () => {
    // arrange
    const galleryId = 'EXPECTED GALLERY ID'
    const moduleId = 'EXPECTED MODULE ID'
    const sort = 'EXPECTED SORT VALUE ID'
    const filterId = 'EXPECTED FILTER ID'
    const moduleSiteId = 'EXPECTED MODULE SITE ID'
    const gallerySiteId = 'EXPECTED GALLERY SITE ID'
    const accessToken = 'EXPECTED ACCESS TOKEN'
    const offset = 20
    const after = 'EXPECTED AFTER'
    const sortSiteId = 'EXPECTED SORT VALUE SITE ID'
    const filterSiteId = 'EXPECTED FILTER SITE ID'
    const search = 'EXPECTED SEARCH'
    const expectedError = new Error('TEST EXCEPTION')

    const initialAction = fetchGallery(galleryId, [filterId], sort, search)
    const galleryProps = { galleryId }
    const moduleProps = { moduleId }

    logger.error = jest.fn()

    // act & assert
    const gen = handleFetchGallery(initialAction)

    expect(gen.next().value).toEqual(select(galleryModuleIdSelector, galleryProps))
    expect(gen.next(moduleId).value).toEqual(select(moduleDefaultGalleryIdSelector, moduleProps))
    expect(gen.next('').value).toEqual(select(moduleSiteIdSelector, moduleProps))

    expect(gen.next(moduleSiteId).value).toEqual(select(gallerySiteIdSelector, galleryProps))
    expect(gen.next(gallerySiteId).value).toEqual(select(galleryAfterSelector, galleryProps))
    expect(gen.next(after).value).toEqual(select(galleryOffsetSelector, galleryProps))
    expect(gen.next(offset).value).toEqual(
      select(defaultSortValueSelector, { ...galleryProps, ...moduleProps, search })
    )

    expect(gen.next('').value).toEqual(select(valueSiteIdSelector, { ...galleryProps, valueId: sort }))

    expect(gen.next(sortSiteId).value).toEqual(all([select(filterSiteIdSelector, { filterId })]))

    expect(gen.next([filterSiteId]).value).toEqual(call(handleRefresh, moduleId))
    expect(gen.next().value).toEqual(select(accessTokenSelector, moduleProps))
    expect(gen.next(accessToken).value).toEqual(
      call(
        lookingGlassService.fetchItems,
        moduleSiteId,
        gallerySiteId,
        accessToken,
        offset,
        after,
        search,
        sortSiteId,
        [filterSiteId]
      )
    )

    expect(gen.throw(expectedError).value).toEqual(put(fetchGalleryFailure(galleryId, expectedError)))
    expect(gen.next().value).toBeUndefined()
    expect(logger.error).toHaveBeenCalled()
  })

  it('uses default gallery', async () => {
    // arrange
    const galleryId = 'EXPECTED GALLERY ID'
    const moduleId = 'EXPECTED MODULE ID'
    const sort = 'EXPECTED SORT VALUE ID'
    const filterId = 'EXPECTED FILTER ID'
    const moduleSiteId = 'EXPECTED MODULE SITE ID'
    const gallerySiteId = 'EXPECTED GALLERY SITE ID'
    const accessToken = 'EXPECTED ACCESS TOKEN'
    const offset = 20
    const after = 'EXPECTED AFTER'
    const sortSiteId = 'EXPECTED SORT VALUE SITE ID'
    const filterSiteId = 'EXPECTED FILTER SITE ID'
    const search = 'EXPECTED SEARCH'
    const expectedData = 'EXPECTED DATA'

    const initialAction = fetchGallery(galleryId, [filterId], sort, search)
    const galleryProps = { galleryId }
    const moduleProps = { moduleId }

    // act & assert
    const gen = handleFetchGallery(initialAction)

    expect(gen.next().value).toEqual(select(galleryModuleIdSelector, galleryProps))
    expect(gen.next(moduleId).value).toEqual(select(moduleDefaultGalleryIdSelector, moduleProps))
    expect(gen.next(galleryId).value).toEqual(select(moduleSiteIdSelector, moduleProps)) // defaultGalleryId === galleryId

    expect(gen.next(moduleSiteId).value).toEqual(select(gallerySiteIdSelector, galleryProps))
    expect(gen.next(gallerySiteId).value).toEqual(select(galleryAfterSelector, galleryProps))
    expect(gen.next(after).value).toEqual(select(galleryOffsetSelector, galleryProps))
    expect(gen.next(offset).value).toEqual(
      select(defaultSortValueSelector, { ...galleryProps, ...moduleProps, search })
    )

    expect(gen.next('').value).toEqual(select(valueSiteIdSelector, { ...galleryProps, valueId: sort }))

    expect(gen.next(sortSiteId).value).toEqual(all([select(filterSiteIdSelector, { filterId })]))

    expect(gen.next([filterSiteId]).value).toEqual(call(handleRefresh, moduleId))
    expect(gen.next().value).toEqual(select(accessTokenSelector, moduleProps))
    expect(gen.next(accessToken).value).toEqual(
      call(lookingGlassService.fetchItems, moduleSiteId, null, accessToken, offset, after, search, sortSiteId, [
        filterSiteId,
      ])
    )

    expect(gen.next({ data: expectedData }).value).toEqual(put(fetchGallerySuccess(moduleId, galleryId, expectedData)))
    expect(gen.next().value).toBeUndefined()
  })

  it('uses default sort', async () => {
    // arrange
    const galleryId = 'EXPECTED GALLERY ID'
    const moduleId = 'EXPECTED MODULE ID'
    const sort = 'EXPECTED SORT VALUE ID'
    const filterId = 'EXPECTED FILTER ID'
    const moduleSiteId = 'EXPECTED MODULE SITE ID'
    const gallerySiteId = 'EXPECTED GALLERY SITE ID'
    const accessToken = 'EXPECTED ACCESS TOKEN'
    const offset = 20
    const after = 'EXPECTED AFTER'
    const sortSiteId = 'EXPECTED SORT VALUE SITE ID'
    const filterSiteId = 'EXPECTED FILTER SITE ID'
    const search = 'EXPECTED SEARCH'
    const expectedData = 'EXPECTED DATA'

    const initialAction = fetchGallery(galleryId, [filterId], null, search) // null sort
    const galleryProps = { galleryId }
    const moduleProps = { moduleId }

    // act & assert
    const gen = handleFetchGallery(initialAction)

    expect(gen.next().value).toEqual(select(galleryModuleIdSelector, galleryProps))
    expect(gen.next(moduleId).value).toEqual(select(moduleDefaultGalleryIdSelector, moduleProps))
    expect(gen.next('').value).toEqual(select(moduleSiteIdSelector, moduleProps))

    expect(gen.next(moduleSiteId).value).toEqual(select(gallerySiteIdSelector, galleryProps))
    expect(gen.next(gallerySiteId).value).toEqual(select(galleryAfterSelector, galleryProps))
    expect(gen.next(after).value).toEqual(select(galleryOffsetSelector, galleryProps))
    expect(gen.next(offset).value).toEqual(
      select(defaultSortValueSelector, { ...galleryProps, ...moduleProps, search })
    )

    expect(gen.next(sort).value).toEqual(select(valueSiteIdSelector, { ...galleryProps, valueId: sort })) // uses default sort

    expect(gen.next(sortSiteId).value).toEqual(all([select(filterSiteIdSelector, { filterId })]))

    expect(gen.next([filterSiteId]).value).toEqual(call(handleRefresh, moduleId))
    expect(gen.next().value).toEqual(select(accessTokenSelector, moduleProps))
    expect(gen.next(accessToken).value).toEqual(
      call(
        lookingGlassService.fetchItems,
        moduleSiteId,
        gallerySiteId,
        accessToken,
        offset,
        after,
        search,
        sortSiteId,
        [filterSiteId]
      )
    )

    expect(gen.next({ data: expectedData }).value).toEqual(put(fetchGallerySuccess(moduleId, galleryId, expectedData)))
    expect(gen.next().value).toBeUndefined()
  })

  it('uses file system service', async () => {
    // arrange
    const galleryId = 'EXPECTED GALLERY ID'
    const moduleId = FILE_SYSTEM_MODULE_ID // file system module
    const sort = 'EXPECTED SORT VALUE ID'
    const filterId = 'EXPECTED FILTER ID'
    const moduleSiteId = 'EXPECTED MODULE SITE ID'
    const gallerySiteId = 'EXPECTED GALLERY SITE ID'
    const accessToken = 'EXPECTED ACCESS TOKEN'
    const offset = 20
    const after = 'EXPECTED AFTER'
    const sortSiteId = 'EXPECTED SORT VALUE SITE ID'
    const filterSiteId = 'EXPECTED FILTER SITE ID'
    const search = 'EXPECTED SEARCH'
    const expectedData = 'EXPECTED DATA'

    const initialAction = fetchGallery(galleryId, [filterId], sort, search)
    const galleryProps = { galleryId }
    const moduleProps = { moduleId }

    // act & assert
    const gen = handleFetchGallery(initialAction)

    expect(gen.next().value).toEqual(select(galleryModuleIdSelector, galleryProps))
    expect(gen.next(moduleId).value).toEqual(select(moduleDefaultGalleryIdSelector, moduleProps))
    expect(gen.next('').value).toEqual(select(moduleSiteIdSelector, moduleProps))

    expect(gen.next(moduleSiteId).value).toEqual(select(gallerySiteIdSelector, galleryProps))
    expect(gen.next(gallerySiteId).value).toEqual(select(galleryAfterSelector, galleryProps))
    expect(gen.next(after).value).toEqual(select(galleryOffsetSelector, galleryProps))
    expect(gen.next(offset).value).toEqual(
      select(defaultSortValueSelector, { ...galleryProps, ...moduleProps, search })
    )

    expect(gen.next('').value).toEqual(select(valueSiteIdSelector, { ...galleryProps, valueId: sort }))

    expect(gen.next(sortSiteId).value).toEqual(all([select(filterSiteIdSelector, { filterId })]))

    expect(gen.next([filterSiteId]).value).toEqual(call(handleRefresh, moduleId))
    expect(gen.next().value).toEqual(select(accessTokenSelector, moduleProps))

    // fileSystemService
    expect(gen.next(accessToken).value).toEqual(
      call(fileSystemService.fetchItems, moduleSiteId, gallerySiteId, accessToken, offset, after, search, sortSiteId, [
        filterSiteId,
      ])
    )

    expect(gen.next({ data: expectedData }).value).toEqual(put(fetchGallerySuccess(moduleId, galleryId, expectedData)))
    expect(gen.next().value).toBeUndefined()
  })

  it('uses empty filter', async () => {
    // arrange
    const galleryId = 'EXPECTED GALLERY ID'
    const moduleId = FILE_SYSTEM_MODULE_ID
    const sort = 'EXPECTED SORT VALUE ID'
    const moduleSiteId = 'EXPECTED MODULE SITE ID'
    const gallerySiteId = 'EXPECTED GALLERY SITE ID'
    const accessToken = 'EXPECTED ACCESS TOKEN'
    const offset = 20
    const after = 'EXPECTED AFTER'
    const sortSiteId = 'EXPECTED SORT VALUE SITE ID'
    const search = 'EXPECTED SEARCH'
    const expectedData = 'EXPECTED DATA'

    const initialAction = fetchGallery(galleryId, [], sort, search) // no filters
    const galleryProps = { galleryId }
    const moduleProps = { moduleId }

    // act & assert
    const gen = handleFetchGallery(initialAction)

    expect(gen.next().value).toEqual(select(galleryModuleIdSelector, galleryProps))
    expect(gen.next(moduleId).value).toEqual(select(moduleDefaultGalleryIdSelector, moduleProps))
    expect(gen.next('').value).toEqual(select(moduleSiteIdSelector, moduleProps))

    expect(gen.next(moduleSiteId).value).toEqual(select(gallerySiteIdSelector, galleryProps))
    expect(gen.next(gallerySiteId).value).toEqual(select(galleryAfterSelector, galleryProps))
    expect(gen.next(after).value).toEqual(select(galleryOffsetSelector, galleryProps))
    expect(gen.next(offset).value).toEqual(
      select(defaultSortValueSelector, { ...galleryProps, ...moduleProps, search })
    )

    expect(gen.next('').value).toEqual(select(valueSiteIdSelector, { ...galleryProps, valueId: sort }))

    expect(gen.next(sortSiteId).value).toEqual(call(handleRefresh, moduleId))

    expect(gen.next().value).toEqual(select(accessTokenSelector, moduleProps))
    expect(gen.next(accessToken).value).toEqual(
      call(fileSystemService.fetchItems, moduleSiteId, gallerySiteId, accessToken, offset, after, search, sortSiteId, [
        /* empty! */
      ])
    )

    expect(gen.next({ data: expectedData }).value).toEqual(put(fetchGallerySuccess(moduleId, galleryId, expectedData)))
    expect(gen.next().value).toBeUndefined()
  })
})

import {
  handleAsyncFetch,
  handleAsyncSuccess,
  handleAsyncError,
  generateModuleId,
  generateItemId,
  generateGalleryId,
  generateSortId,
  generateBreadcrumbId,
  generateFilterSectionId,
  generateFilterId,
} from '../constants'

it('handleAsyncFetch', () => {
  const state = {}
  handleAsyncFetch(state)
  expect(state.fetching).toEqual(true)
  expect(state.error).toEqual(null)
})

it('handleAsyncSuccess', () => {
  const state = {}
  handleAsyncSuccess(state)
  expect(state.fetching).toEqual(false)
  expect(state.fetched).toEqual(true)
  expect(state.error).toEqual(null)
})

it('handleAsyncError', () => {
  const state = {}
  handleAsyncError(state, 'EXPECTED')
  expect(state.fetching).toEqual(false)
  expect(state.fetched).toEqual(true)
  expect(state.error).toEqual('EXPECTED')
})

it('generateModuleId generates deterministic ids', () => {
  expect(generateModuleId('MODULE ID')).toEqual(generateModuleId('MODULE ID'))
})

it('generateItemId generates deterministic ids', () => {
  expect(generateItemId('GALLERY ID', 'ITEM ID')).toEqual(generateItemId('GALLERY ID', 'ITEM ID'))
})

it('generateGalleryId generates deterministic ids', () => {
  expect(generateGalleryId('MODULE ID', 'GALLERY ID')).toEqual(generateGalleryId('MODULE ID', 'GALLERY ID'))
})

it('generateSortId generates deterministic ids', () => {
  expect(generateSortId('MODULE ID', 'SORT ID')).toEqual(generateSortId('MODULE ID', 'SORT ID'))
})

it('generateBreadcrumbId generates deterministic ids', () => {
  expect(generateBreadcrumbId('MODULE ID', 'GALLERY ID')).toEqual(generateBreadcrumbId('MODULE ID', 'GALLERY ID'))
})

it('generateFilterSectionId generates deterministic ids', () => {
  expect(generateFilterSectionId('MODULE ID', 'FILTER SECTION ID')).toEqual(
    generateFilterSectionId('MODULE ID', 'FILTER SECTION ID')
  )
})

it('generateFilterId generates deterministic ids', () => {
  expect(generateFilterId('FILTER SECTION ID', 'FILTER ID')).toEqual(generateFilterId('FILTER SECTION ID', 'FILTER ID'))
})

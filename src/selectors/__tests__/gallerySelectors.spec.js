import * as gallerySelectors from '../gallerySelectors'

it('allIdsSelector selects expected', () => {
  const expected = [...Array(3).keys()].map((id) => id.toString())
  const expectedState = { gallery: { allIds: expected } }
  expect(gallerySelectors.allIdsSelector(expectedState)).toEqual(expected)
})

it('byIdSelector selects expected', () => {
  const expected = [...Array(3).keys()].reduce((acc, id) => ({ ...acc, [id]: { id } }), {})
  const expectedState = { gallery: { byId: expected } }
  expect(gallerySelectors.byIdSelector(expectedState)).toEqual(expected)
})

it('gallerySelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: expected } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.gallerySelector(expectedState, expectedProps)).toEqual(expected)
})

it('gallerySavedScrollPositionSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { savedScrollPosition: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.gallerySavedScrollPositionSelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryFetchingSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { fetching: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryFetchingSelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryItemsSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { items: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryItemsSelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryNameSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { name: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryNameSelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryFilterSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { currentFilter: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryFilterSelector(expectedState, expectedProps)).toEqual(expected)
})

it('gallerySortSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { currentSort: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.gallerySortSelector(expectedState, expectedProps)).toEqual(expected)
})

it('gallerySearchQuerySelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { searchQuery: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.gallerySearchQuerySelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryHasNextSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { hasNext: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryHasNextSelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryAfterSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { after: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryAfterSelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryOffsetSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { offset: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryOffsetSelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryParentIdSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { parentId: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryParentIdSelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryModuleIdSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { moduleId: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryModuleIdSelector(expectedState, expectedProps)).toEqual(expected)
})

it('gallerySiteIdSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { siteId: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.gallerySiteIdSelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryErrorSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { error: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryErrorSelector(expectedState, expectedProps)).toEqual(expected)
})

it('galleryFetchedSelector selects expected', () => {
  const expected = 'EXPECTED'
  const galleryId = 'EXPECTED GALLERY ID'
  const expectedState = { gallery: { byId: { [galleryId]: { fetched: expected } } } }
  const expectedProps = { galleryId }
  expect(gallerySelectors.galleryFetchedSelector(expectedState, expectedProps)).toEqual(expected)
})

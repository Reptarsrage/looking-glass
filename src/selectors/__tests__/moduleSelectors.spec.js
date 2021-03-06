import * as moduleSelectors from '../moduleSelectors'

it('allIdsSelector selects expected', () => {
  const expectedModules = [...Array(3).keys()].map((id) => id.toString())
  const expectedState = { module: { allIds: expectedModules } }
  expect(moduleSelectors.allIdsSelector(expectedState)).toEqual(expectedModules)
})

it('byIdSelector selects expected', () => {
  const expectedModules = [...Array(3).keys()].reduce((acc, id) => ({ ...acc, [id]: { id } }), {})
  const expectedState = { module: { byId: expectedModules } }
  expect(moduleSelectors.byIdSelector(expectedState)).toEqual(expectedModules)
})

it('modulesSelector selects expected', () => {
  const expectedModules = ['0', '1', '2']
  const expectedState = {
    module: {
      allIds: expectedModules,
      byId: expectedModules.reduce((acc, id, i) => ({ ...acc, [id]: { id, name: `TITLE ${3 - i}` } }), {}),
    },
  }

  expect(moduleSelectors.modulesSelector(expectedState)).toEqual(['2', '1', '0'])
})

it('fetchingSelector selects expected', () => {
  const expected = true
  const expectedState = { module: { fetching: expected } }
  expect(moduleSelectors.fetchingSelector(expectedState)).toEqual(expected)
})

it('fetchedSelector selects expected', () => {
  const expected = true
  const expectedState = { module: { fetched: expected } }
  expect(moduleSelectors.fetchedSelector(expectedState)).toEqual(expected)
})

it('errorSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const expectedState = { module: { error: expected } }
  expect(moduleSelectors.errorSelector(expectedState)).toEqual(expected)
})

it('moduleSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: expected } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleSiteIdSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { siteId: expected } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleSiteIdSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleNameSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { name: expected } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleNameSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleDescriptionSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { description: expected } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleDescriptionSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleIconSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { icon: expected } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleIconSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleOAuthUrlSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { oAuthUrl: expected } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleOAuthUrlSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleAuthTypeSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { authType: expected } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleAuthTypeSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleFilterSectionsSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { filters: expected } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleFilterSectionsSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleSortSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { sort: expected } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleSortSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleDefaultGalleryIdSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { defaultGalleryId: expected } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleDefaultGalleryIdSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleSupportsItemFiltersSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { supportsItemFilters: expected } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleSupportsItemFiltersSelector(expectedState, expectedProps)).toEqual(expected)
})

it('moduleSupportsSortingSelector selects expected when given null', () => {
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { sort: null } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleSupportsSortingSelector(expectedState, expectedProps)).toEqual(false)
})

it('moduleSupportsSortingSelector selects expected when given empty', () => {
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { sort: [] } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleSupportsSortingSelector(expectedState, expectedProps)).toEqual(false)
})

it('moduleSupportsSortingSelector selects expected when given array', () => {
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { sort: [{}, {}, {}] } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleSupportsSortingSelector(expectedState, expectedProps)).toEqual(true)
})

it('moduleSupportsFilteringSelector selects expected when given null', () => {
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { filters: null } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleSupportsFilteringSelector(expectedState, expectedProps)).toEqual(false)
})

it('moduleSupportsFilteringSelector selects expected when given empty', () => {
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { filters: [] } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleSupportsFilteringSelector(expectedState, expectedProps)).toEqual(false)
})

it('moduleSupportsFilteringSelector selects expected when given array', () => {
  const moduleId = 'EXPECTED MODULE ID'

  const expectedState = { module: { byId: { [moduleId]: { filters: [{}, {}, {}] } } } }
  const expectedProps = { moduleId }

  expect(moduleSelectors.moduleSupportsFilteringSelector(expectedState, expectedProps)).toEqual(true)
})

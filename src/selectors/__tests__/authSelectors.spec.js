import * as authSelectors from '../authSelectors'

it('allIdsSelector selects expected', () => {
  const expected = [...Array(3).keys()].map((id) => id.toString())
  const expectedState = { auth: { allIds: expected } }
  expect(authSelectors.allIdsSelector(expectedState)).toEqual(expected)
})

it('byIdSelector selects expected', () => {
  const expected = [...Array(3).keys()].reduce((acc, id) => ({ ...acc, [id]: { id } }), {})
  const expectedState = { auth: { byId: expected } }
  expect(authSelectors.byIdSelector(expectedState)).toEqual(expected)
})

it('authByModuleIdSelector selects expected', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: { [moduleId]: expected } } }
  const expectedProps = { moduleId }
  expect(authSelectors.authByModuleIdSelector(expectedState, expectedProps)).toEqual(expected)
})

it('fetchingSelector selects expected when module found', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: { [moduleId]: { fetching: expected } } } }
  const expectedProps = { moduleId }
  expect(authSelectors.fetchingSelector(expectedState, expectedProps)).toEqual(expected)
})

it('fetchingSelector selects expected when module not found', () => {
  const expected = undefined
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: {} } }
  const expectedProps = { moduleId }
  expect(authSelectors.fetchingSelector(expectedState, expectedProps)).toEqual(expected)
})

it('errorSelector selects expected when module found', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: { [moduleId]: { error: expected } } } }
  const expectedProps = { moduleId }
  expect(authSelectors.errorSelector(expectedState, expectedProps)).toEqual(expected)
})

it('errorSelector selects expected when module not found', () => {
  const expected = undefined
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: {} } }
  const expectedProps = { moduleId }
  expect(authSelectors.errorSelector(expectedState, expectedProps)).toEqual(expected)
})

it('fetchedSelector selects expected when module found', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: { [moduleId]: { fetched: expected } } } }
  const expectedProps = { moduleId }
  expect(authSelectors.fetchedSelector(expectedState, expectedProps)).toEqual(expected)
})

it('fetchedSelector selects expected when module not found', () => {
  const expected = undefined
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: {} } }
  const expectedProps = { moduleId }
  expect(authSelectors.fetchedSelector(expectedState, expectedProps)).toEqual(expected)
})

it('accessTokenSelector selects expected when module found', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: { [moduleId]: { accessToken: expected } } } }
  const expectedProps = { moduleId }
  expect(authSelectors.accessTokenSelector(expectedState, expectedProps)).toEqual(expected)
})

it('accessTokenSelector selects expected when module not found', () => {
  const expected = undefined
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: {} } }
  const expectedProps = { moduleId }
  expect(authSelectors.accessTokenSelector(expectedState, expectedProps)).toEqual(expected)
})

it('refreshTokenSelector selects expected when module found', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: { [moduleId]: { refreshToken: expected } } } }
  const expectedProps = { moduleId }
  expect(authSelectors.refreshTokenSelector(expectedState, expectedProps)).toEqual(expected)
})

it('refreshTokenSelector selects expected when module not found', () => {
  const expected = undefined
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: {} } }
  const expectedProps = { moduleId }
  expect(authSelectors.refreshTokenSelector(expectedState, expectedProps)).toEqual(expected)
})

it('expiresSelector selects expected when module found', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: { [moduleId]: { expires: expected } } } }
  const expectedProps = { moduleId }
  expect(authSelectors.expiresSelector(expectedState, expectedProps)).toEqual(expected)
})

it('expiresSelector selects expected when module not found', () => {
  const expected = undefined
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = { auth: { byId: {} } }
  const expectedProps = { moduleId }
  expect(authSelectors.expiresSelector(expectedState, expectedProps)).toEqual(expected)
})

it('requiresAuthSelector selects expected when true', () => {
  const expected = 'EXPECTED ERROR'
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = {
    module: { byId: { [moduleId]: { authType: expected } } },
  }
  const expectedProps = { moduleId }
  expect(authSelectors.requiresAuthSelector(expectedState, expectedProps)).toEqual(true)
})

it('requiresAuthSelector selects expected when false', () => {
  const expected = ''
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = {
    module: { byId: { [moduleId]: { authType: expected } } },
  }
  const expectedProps = { moduleId }
  expect(authSelectors.requiresAuthSelector(expectedState, expectedProps)).toEqual(false)
})

it('isAuthenticatedSelector selects expected when true', () => {
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = {
    module: { byId: { [moduleId]: { authType: 'AUTH TYPE' } } },
    auth: { byId: { [moduleId]: { fetched: true } } },
  }

  const expectedProps = { moduleId }
  expect(authSelectors.isAuthenticatedSelector(expectedState, expectedProps)).toEqual(true)
})

it('isAuthenticatedSelector selects expected when module not found', () => {
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = {
    module: { byId: { [moduleId]: { authType: 'AUTH TYPE' } } },
    auth: { byId: {} },
  }

  const expectedProps = { moduleId }
  expect(authSelectors.isAuthenticatedSelector(expectedState, expectedProps)).toEqual(false)
})

it('isAuthenticatedSelector selects expected when false', () => {
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = {
    module: { byId: { [moduleId]: { authType: 'AUTH TYPE' } } },
    auth: { byId: { [moduleId]: { fetched: false } } },
  }

  const expectedProps = { moduleId }
  expect(authSelectors.isAuthenticatedSelector(expectedState, expectedProps)).toEqual(false)
})

it('isAuthenticatedSelector selects expected when module has no auth', () => {
  const moduleId = 'EXPECTED MODULE ID'
  const expectedState = {
    module: { byId: { [moduleId]: { authType: '' } } },
    auth: { byId: { [moduleId]: { fetched: false } } },
  }

  const expectedProps = { moduleId }
  expect(authSelectors.isAuthenticatedSelector(expectedState, expectedProps)).toEqual(true)
})

it('authUrlSelector selects expected', () => {
  const moduleId = 'EXPECTED MODULE ID'
  const galleryId = 'EXPECTED GALLERY ID'
  const authType = 'EXPECTED AUTH TYPE'
  const expectedProps = { moduleId, galleryId }
  const expectedState = {
    module: { byId: { [moduleId]: { authType } } },
  }

  expect(authSelectors.authUrlSelector(expectedState, expectedProps)).toEqual(`/${authType}/${moduleId}/${galleryId}`)
})

it('authUrlSelector selects expected when null', () => {
  const moduleId = 'EXPECTED MODULE ID'
  const galleryId = 'EXPECTED GALLERY ID'
  const authType = null
  const expectedProps = { moduleId, galleryId }
  const expectedState = {
    module: { byId: { [moduleId]: { authType } } },
  }

  expect(authSelectors.authUrlSelector(expectedState, expectedProps)).toEqual(null)
})

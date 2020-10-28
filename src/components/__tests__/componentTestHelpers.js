import React from 'react'
import { Provider } from 'react-redux'
import { render as rtlRender } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'

// build a mock redux store
export const mockStore = configureMockStore()

// define a helper to render connected components
const render = (ui, { initialState, store = mockStore(initialState), ...renderOptions } = {}) => {
  // eslint-disable-next-line react/prop-types
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { render }

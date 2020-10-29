/* eslint-disable react/prop-types */
import React from 'react'

import './__mocks__/ResizeObserver'
import { render } from './componentTestHelpers'
import Masonry from '../Masonry'

describe('<Masonry />', () => {
  it('renders', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      initialScrollTop: 0,
      getItemDimensions: mockItemDimensions,
      onScroll: jest.fn(),
      ChildComponent: ({ itemId }) => <div data-testid={itemId} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { getByTestId } = render(<Masonry {...props} />)

    // assert
    expect(mockItemDimensions).toHaveBeenCalledTimes(props.items.length)
    for (const key of props.items) {
      expect(getByTestId(key)).toBeInTheDocument()
      expect(mockItemDimensions).toHaveBeenCalledWith(key)
    }
  })
})

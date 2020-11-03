/* eslint-disable react/prop-types */
import React from 'react'

// eslint-disable-next-line jest/no-mocks-import
import './__mocks__/ResizeObserver'
import { render } from './componentTestHelpers'
import { JustMasonry } from '../Masonry'

describe('<Masonry />', () => {
  it('renders all items', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      getItemDimensions: mockItemDimensions,
      width: 342,
      height: 332,
      columnCount: 3,
      scrollTop: 0,
      gutter: 8,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { getByTestId } = render(<JustMasonry {...props} />)

    // assert
    for (const key of props.items) {
      expect(getByTestId(key)).toBeInTheDocument()
    }
  })

  it('renders only visible items', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      getItemDimensions: mockItemDimensions,
      width: 342, // 3 columns, 4 gutters, 1 scroll bar
      height: 116,
      columnCount: 3,
      scrollTop: 0,
      gutter: 8,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { queryByTestId, getByTestId } = render(<JustMasonry {...props} />)

    // assert
    for (let i = 0; i < props.items.length; i += 1) {
      const key = props.items[i]
      if (i < 6) {
        expect(getByTestId(key)).toBeInTheDocument()
      } else {
        expect(queryByTestId(key)).not.toBeInTheDocument()
      }
    }
  })

  it('renders only visible items after scroll', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      getItemDimensions: mockItemDimensions,
      width: 342, // 3 columns, 4 gutters, 1 scroll bar
      height: 116,
      columnCount: 3,
      scrollTop: 0,
      gutter: 8,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { queryByTestId, rerender, getByTestId } = render(<JustMasonry {...props} />)
    rerender(<JustMasonry {...props} scrollTop={224} />)

    // assert
    for (let i = 0; i < props.items.length; i += 1) {
      const key = props.items[i]
      if (i > 5) {
        expect(getByTestId(key)).toBeInTheDocument()
      } else {
        expect(queryByTestId(key)).not.toBeInTheDocument()
      }
    }
  })

  it('renders only visible items after width resize', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      getItemDimensions: mockItemDimensions,
      width: 342, // 3 columns, 4 gutters, 1 scroll bar
      height: 66,
      columnCount: 3,
      scrollTop: 0,
      gutter: 8,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { queryByTestId, rerender, getByTestId } = render(<JustMasonry {...props} />)
    rerender(<JustMasonry {...props} width={192} />)

    // assert
    for (let i = 0; i < props.items.length; i += 1) {
      const key = props.items[i]
      if (i < 6) {
        expect(getByTestId(key)).toBeInTheDocument()
      } else {
        expect(queryByTestId(key)).not.toBeInTheDocument()
      }
    }
  })

  it('renders only visible items after height resize', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      getItemDimensions: mockItemDimensions,
      width: 342, // 3 columns, 4 gutters, 1 scroll bar
      height: 116,
      columnCount: 3,
      scrollTop: 0,
      gutter: 8,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { queryByTestId, rerender, getByTestId } = render(<JustMasonry {...props} />)
    rerender(<JustMasonry {...props} height={115} />)

    // assert
    for (let i = 0; i < props.items.length; i += 1) {
      const key = props.items[i]
      if (i < 3) {
        expect(getByTestId(key)).toBeInTheDocument()
      } else {
        expect(queryByTestId(key)).not.toBeInTheDocument()
      }
    }
  })

  it('renders only visible items after scrollBarSize changes', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      getItemDimensions: mockItemDimensions,
      width: 342, // 3 columns, 4 gutters, 1 scroll bar
      height: 115, // force render of only first row
      columnCount: 3,
      scrollTop: 0,
      gutter: 8,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { queryByTestId, rerender, getByTestId } = render(<JustMasonry {...props} />)
    rerender(<JustMasonry {...props} scrollBarSize={20} />)

    // assert
    for (let i = 0; i < props.items.length; i += 1) {
      const key = props.items[i]
      if (i < 6) {
        expect(getByTestId(key)).toBeInTheDocument()
      } else {
        expect(queryByTestId(key)).not.toBeInTheDocument()
      }
    }
  })

  it('renders only visible items after gutter changes', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      getItemDimensions: mockItemDimensions,
      width: 342, // 3 columns, 4 gutters, 1 scroll bar
      height: 114, // force render of only first row
      columnCount: 3,
      scrollTop: 0,
      gutter: 8,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { queryByTestId, rerender, getByTestId } = render(<JustMasonry {...props} />)
    rerender(<JustMasonry {...props} gutter={7} />)

    // assert
    for (let i = 0; i < props.items.length; i += 1) {
      const key = props.items[i]
      if (i < 6) {
        expect(getByTestId(key)).toBeInTheDocument()
      } else {
        expect(queryByTestId(key)).not.toBeInTheDocument()
      }
    }
  })

  it('renders only visible items after columnCount changes', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      getItemDimensions: mockItemDimensions,
      width: 342, // 3 columns, 4 gutters, 1 scroll bar
      height: 116,
      columnCount: 3,
      scrollTop: 0,
      gutter: 8,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { queryByTestId, rerender, getByTestId } = render(<JustMasonry {...props} />)
    rerender(<JustMasonry {...props} columnCount={4} />)

    // assert
    for (let i = 0; i < props.items.length; i += 1) {
      const key = props.items[i]
      if (i < 8) {
        expect(getByTestId(key)).toBeInTheDocument()
      } else {
        expect(queryByTestId(key)).not.toBeInTheDocument()
      }
    }
  })

  it('renders only visible items after items change', () => {
    // arrange
    const newItems = [...Array(10).keys()].map((i) => `${i + 100}`)
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      getItemDimensions: mockItemDimensions,
      width: 342, // 3 columns, 4 gutters, 1 scroll bar
      height: 116,
      columnCount: 3,
      scrollTop: 0,
      gutter: 8,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { queryByTestId, rerender, getByTestId } = render(<JustMasonry {...props} />)
    rerender(<JustMasonry {...props} items={newItems} />)

    // assert
    for (let i = 0; i < newItems.length; i += 1) {
      const key = newItems[i]
      if (i < 6) {
        expect(getByTestId(key)).toBeInTheDocument()
      } else {
        expect(queryByTestId(key)).not.toBeInTheDocument()
      }
    }
  })

  it("two instances don't conflict", () => {
    const mockItemDimensions = jest.fn()
    const props = {
      items: [...Array(10).keys()].map((i) => `${i}`),
      getItemDimensions: mockItemDimensions,
      width: 342,
      height: 332,
      columnCount: 3,
      scrollTop: 0,
      gutter: 8,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)
    const { queryAllByTestId } = render(<JustMasonry {...props} height={116} />)

    // assert
    for (let i = 0; i < props.items.length; i += 1) {
      const key = props.items[i]
      if (i < 6) {
        expect(queryAllByTestId(key)).toHaveLength(2) // renders in both documents
      } else {
        expect(queryAllByTestId(key)).toHaveLength(1) // renders in one document
      }
    }
  })
})

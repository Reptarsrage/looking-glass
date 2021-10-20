/* eslint-disable react/prop-types */
import React from 'react'
import { screen } from '@testing-library/react'

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
      overscan: 0,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)

    // assert
    props.items.forEach((key) => {
      expect(screen.getByTestId(key)).toBeInTheDocument()
    })
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
      overscan: 0,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)

    // assert
    props.items.slice(0, 6).forEach((key) => {
      expect(screen.getByTestId(key)).toBeInTheDocument()
    })

    props.items.slice(6).forEach((key) => {
      expect(screen.queryByTestId(key)).not.toBeInTheDocument()
    })
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
      overscan: 0,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)
    screen.rerender(<JustMasonry {...props} scrollTop={224} />)

    // assert
    props.items.slice(6).forEach((key) => {
      expect(screen.getByTestId(key)).toBeInTheDocument()
    })

    props.items.slice(0, 6).forEach((key) => {
      expect(screen.queryByTestId(key)).not.toBeInTheDocument()
    })
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
      overscan: 0,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)
    screen.rerender(<JustMasonry {...props} width={192} />)

    // assert
    props.items.slice(0, 6).forEach((key) => {
      expect(screen.getByTestId(key)).toBeInTheDocument()
    })

    props.items.slice(6).forEach((key) => {
      expect(screen.queryByTestId(key)).not.toBeInTheDocument()
    })
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
      overscan: 0,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)
    screen.rerender(<JustMasonry {...props} height={115} />)

    // assert
    props.items.slice(0, 3).forEach((key) => {
      expect(screen.getByTestId(key)).toBeInTheDocument()
    })

    props.items.slice(3).forEach((key) => {
      expect(screen.queryByTestId(key)).not.toBeInTheDocument()
    })
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
      overscan: 0,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)
    screen.rerender(<JustMasonry {...props} scrollBarSize={20} />)

    // assert
    props.items.slice(0, 6).forEach((key) => {
      expect(screen.getByTestId(key)).toBeInTheDocument()
    })

    props.items.slice(6).forEach((key) => {
      expect(screen.queryByTestId(key)).not.toBeInTheDocument()
    })
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
      overscan: 0,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)
    screen.rerender(<JustMasonry {...props} gutter={7} />)

    // assert
    props.items.slice(0, 6).forEach((key) => {
      expect(screen.getByTestId(key)).toBeInTheDocument()
    })

    props.items.slice(6).forEach((key) => {
      expect(screen.queryByTestId(key)).not.toBeInTheDocument()
    })
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
      overscan: 0,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)
    screen.rerender(<JustMasonry {...props} columnCount={4} />)

    // assert
    props.items.slice(0, 8).forEach((key) => {
      expect(screen.getByTestId(key)).toBeInTheDocument()
    })

    props.items.slice(8).forEach((key) => {
      expect(screen.queryByTestId(key)).not.toBeInTheDocument()
    })
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
      overscan: 0,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)
    screen.rerender(<JustMasonry {...props} items={newItems} />)

    // assert
    newItems.slice(0, 6).forEach((key) => {
      expect(screen.getByTestId(key)).toBeInTheDocument()
    })

    newItems.slice(6).forEach((key) => {
      expect(screen.queryByTestId(key)).not.toBeInTheDocument()
    })
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
      overscan: 0,
      scrollBarSize: 10,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<JustMasonry {...props} />)
    render(<JustMasonry {...props} height={116} />)

    // assert
    props.items.slice(0, 6).forEach((key) => {
      expect(screen.queryAllByTestId(key)).toHaveLength(2)
    })

    props.items.slice(6).forEach((key) => {
      expect(screen.queryAllByTestId(key)).toHaveLength(1)
    })
  })
})

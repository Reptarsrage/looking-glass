/* eslint-disable react/prop-types */
import React from 'react'
import { screen } from '@testing-library/react'

import { render } from './componentTestHelpers'
import Virtualized from '../Virtualized'

describe('<Virtualized />', () => {
  it('renders all items', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 500,
      scrollTop: 0,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<Virtualized {...props} />)

    // assert
    expect(screen.getByTestId('1')).toBeInTheDocument()
    expect(screen.getByTestId('2')).toBeInTheDocument()
    expect(screen.getByTestId('3')).toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(3)
    expect(mockItemDimensions).toHaveBeenCalledWith('1')
    expect(mockItemDimensions).toHaveBeenCalledWith('2')
    expect(mockItemDimensions).toHaveBeenCalledWith('3')
  })

  it('renders only first item', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 100,
      scrollTop: 0,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<Virtualized {...props} />)

    // assert
    expect(screen.getByTestId('1')).toBeInTheDocument()
    expect(screen.queryByTestId('2')).not.toBeInTheDocument()
    expect(screen.queryByTestId('3')).not.toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(1)
    expect(mockItemDimensions).toHaveBeenCalledWith('1')
  })

  it('renders only second item', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 100,
      scrollTop: 120, // gutter + gutter + height of first item
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<Virtualized {...props} />)

    // assert
    expect(screen.queryByTestId('1')).not.toBeInTheDocument()
    expect(screen.getByTestId('2')).toBeInTheDocument()
    expect(screen.queryByTestId('3')).not.toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(2)
    expect(mockItemDimensions).toHaveBeenCalledWith('1')
    expect(mockItemDimensions).toHaveBeenCalledWith('2')
  })

  it('renders first two items', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 100,
      scrollTop: 50,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<Virtualized {...props} />)

    // assert
    expect(screen.getByTestId('1')).toBeInTheDocument()
    expect(screen.getByTestId('2')).toBeInTheDocument()
    expect(screen.queryByTestId('3')).not.toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(2)
    expect(mockItemDimensions).toHaveBeenCalledWith('1')
    expect(mockItemDimensions).toHaveBeenCalledWith('2')
  })

  it('updates when scrollTop changes', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 100,
      scrollTop: 0,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { rerender } = render(<Virtualized {...props} />)
    rerender(<Virtualized {...props} scrollTop={120} />)

    // assert
    expect(screen.queryByTestId('1')).not.toBeInTheDocument()
    expect(screen.getByTestId('2')).toBeInTheDocument()
    expect(screen.queryByTestId('3')).not.toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(2)
    expect(mockItemDimensions).toHaveBeenCalledWith('1')
    expect(mockItemDimensions).toHaveBeenCalledWith('2')
  })

  it('recalculates when width changes', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 500,
      scrollTop: 0,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { rerender } = render(<Virtualized {...props} />)
    rerender(<Virtualized {...props} width={101} />)

    // assert
    expect(screen.getByTestId('1')).toBeInTheDocument()
    expect(screen.getByTestId('2')).toBeInTheDocument()
    expect(screen.getByTestId('3')).toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(6)
  })

  it('recalculates when items length change', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 500,
      scrollTop: 0,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { rerender } = render(<Virtualized {...props} />)
    rerender(<Virtualized {...props} items={[]} />)
    rerender(<Virtualized {...props} />)

    // assert
    expect(screen.getByTestId('1')).toBeInTheDocument()
    expect(screen.getByTestId('2')).toBeInTheDocument()
    expect(screen.getByTestId('3')).toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(6)
  })

  it('recalculates when items change', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 500,
      scrollTop: 0,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: [],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { rerender } = render(<Virtualized {...props} />)
    rerender(<Virtualized {...props} items={['4', '5', '6']} />)

    // assert
    expect(screen.getByTestId('4')).toBeInTheDocument()
    expect(screen.getByTestId('5')).toBeInTheDocument()
    expect(screen.getByTestId('6')).toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(6)
  })

  it('renders forced item', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3', '4'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 100,
      scrollTop: 0,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: ['4'],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    render(<Virtualized {...props} />)

    // assert
    expect(screen.getByTestId('1')).toBeInTheDocument()
    expect(screen.queryByTestId('2')).not.toBeInTheDocument()
    expect(screen.queryByTestId('3')).not.toBeInTheDocument()
    expect(screen.getByTestId('4')).toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(4)
  })

  it('recalculates when forced items length change', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3', '4', '5'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 500,
      scrollTop: 0,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: ['4', '5'],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { rerender } = render(<Virtualized {...props} />)
    rerender(<Virtualized {...props} forceRenderItems={[]} />)

    // assert
    expect(screen.getByTestId('1')).toBeInTheDocument()
    expect(screen.getByTestId('2')).toBeInTheDocument()
    expect(screen.getByTestId('3')).toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(5)
  })

  it('recalculates when forced items change', () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3', '4', '5'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 300,
      scrollTop: 0,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: ['4', '5'],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { rerender } = render(<Virtualized {...props} />)
    rerender(<Virtualized {...props} forceRenderItems={['2', '3']} />)

    // assert
    expect(screen.getByTestId('1')).toBeInTheDocument()
    expect(screen.getByTestId('2')).toBeInTheDocument()
    expect(screen.getByTestId('3')).toBeInTheDocument()
    expect(screen.queryByTestId('4')).not.toBeInTheDocument()
    expect(screen.queryByTestId('5')).not.toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(5)
  })

  it("doesn't rerender when props are equal", () => {
    // arrange
    const mockItemDimensions = jest.fn()
    const props = {
      items: ['1', '2', '3', '4'],
      left: 10,
      getAdjustedDimensionsForItem: mockItemDimensions,
      width: 100,
      height: 500,
      scrollTop: 0,
      gutter: 10,
      overscan: 0,
      scrollDirection: 1,
      forceRenderItems: ['4'],
      ChildComponent: ({ itemId, style }) => <div data-testid={itemId} style={style} />,
    }

    mockItemDimensions.mockImplementation(() => ({ width: 100, height: 100, top: 0, left: 0 }))

    // act
    const { rerender } = render(<Virtualized {...props} />)
    rerender(<Virtualized {...props} />)

    // assert
    expect(screen.getByTestId('1')).toBeInTheDocument()
    expect(screen.getByTestId('2')).toBeInTheDocument()
    expect(screen.getByTestId('3')).toBeInTheDocument()
    expect(screen.getByTestId('4')).toBeInTheDocument()

    expect(mockItemDimensions).toHaveBeenCalledTimes(4)
  })
})

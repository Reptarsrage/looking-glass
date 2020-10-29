// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
class ResizeObserver {
  constructor(callback) {
    callback([{ contentRect: { width: 100, height: 500 } }])
  }

  observe = jest.fn()

  unobserve = jest.fn()

  disconnect = jest.fn()
}

window.ResizeObserver = ResizeObserver

export default ResizeObserver

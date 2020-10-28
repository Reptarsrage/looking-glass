import React, { useRef, useState, useEffect } from 'react'

const withResize = (WrappedComponent) => (props) => {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const handleResize = (event) => {
    const [elt] = event
    const { contentRect } = elt
    setWidth(contentRect.width)
    setHeight(contentRect.height)
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize)
    const containerElt = containerRef.current
    resizeObserver.observe(containerElt)

    return () => {
      resizeObserver.unobserve(containerElt)
    }
  }, [])

  return (
    <div ref={containerRef} style={{ flex: '1 1' }}>
      {width && height && <WrappedComponent {...props} width={width} height={height} />}
    </div>
  )
}

export default withResize

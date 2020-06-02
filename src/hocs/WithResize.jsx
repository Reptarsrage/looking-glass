import React, { useRef, useState, useEffect } from 'react';

const withResize = (WrappedComponent) => (props) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleResize = (e) => {
    const [elt] = e;
    const { contentRect } = elt;
    setWidth(contentRect.width);
    setHeight(contentRect.height);
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    const containerElt = containerRef.current;
    resizeObserver.observe(containerElt);

    return () => {
      resizeObserver.unobserve(containerElt);
    };
  }, ['hot']);

  return (
    <div ref={containerRef} style={{ overflow: 'visible', flex: '1 1 auto' }}>
      {width && height && <WrappedComponent {...props} width={width} height={height} />}
    </div>
  );
};

export default withResize;

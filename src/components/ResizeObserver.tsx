import { useRef, useState, useEffect } from "react";

export interface Size {
  width: number;
  height: number;
}

export interface WithResizeProps {
  children: (size: Size) => React.ReactNode;
}

export const useResize = (element = document.body) => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  const handleResize: ResizeObserverCallback = (event) => {
    const [elt] = event;
    const { contentRect } = elt;
    setSize([contentRect.width, contentRect.height]);
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, []);

  return size;
};

const ResizeObserverComponent: React.FC<WithResizeProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleResize: ResizeObserverCallback = (event) => {
    const [elt] = event;
    const { contentRect } = elt;
    setWidth(contentRect.width);
    setHeight(contentRect.height);
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    const containerElt = containerRef.current;
    if (containerElt !== null) {
      resizeObserver.observe(containerElt);

      return () => {
        resizeObserver.unobserve(containerElt);
      };
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {width && height && children({ width, height })}
    </div>
  );
};

export default ResizeObserverComponent;

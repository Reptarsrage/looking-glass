import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const styles = () => ({
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
  },
});
const ImageWithZoom = ({
  classes,
  enableZoom,
  width,
  height,
  src,
  title,
  styleName,
  zoom,
  maxZoom,
  initialZoom,
  initialX,
  initialY,
  ...other
}) => {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [bgWidth, setBgWidth] = useState(0);
  const [bgHeight, setBgHeight] = useState(0);
  const [bgPosX, setBgPosX] = useState(0);
  const [bgPosY, setBgPosY] = useState(0);
  const [isDragging, setIsDragging] = useState(0);

  const imageRef = useRef(null);
  const refState = useRef({
    transparentSpaceFiller: null,
    previousEvent: null,
    dragging: false,
    x: 0,
    y: 0,
  }).current;

  // Effect to unload image from memory
  useEffect(() => {
    if (!imageRef.current.hasAttribute('src')) {
      imageRef.current.setAttribute('src', src);
    }

    return () => {
      imageRef.current.removeAttribute('src');
    };
  }, []);

  // Effect to bootstrap zooming
  useEffect(() => {
    if (!enableZoom) {
      return undefined;
    }

    const img = imageRef.current;
    const { transparentSpaceFiller } = refState;
    if (img.src === transparentSpaceFiller) {
      return undefined;
    }

    // Save original
    const originalProperties = {
      backgroundImage: img.style.backgroundImage,
      backgroundRepeat: img.style.backgroundRepeat,
      src: img.src,
    };

    // Calculate styles and position
    const initial = Math.max(initialZoom, 1);
    const computedStyle = window.getComputedStyle(img, null);
    const w = parseInt(computedStyle.width, 10);
    const h = parseInt(computedStyle.height, 10);
    const bw = w * initial;
    const bh = h * initial;
    const x = -(bw - w) * initialX;
    const y = -(bh - h) * initialY;

    setMeasuredWidth(w);
    setMeasuredHeight(h);
    setBgWidth(bw);
    setBgHeight(bh);
    setBgPosX(x);
    setBgPosY(y);

    refState.x = x;
    refState.y = y;

    // Set src to background
    img.style.backgroundRepeat = 'no-repeat';
    img.style.backgroundImage = `url("${img.src}")`;
    img.style.backgroundSize = `${bw}px ${bh}px`;
    img.style.backgroundPosition = `${x}px ${y}px`;
    img.src = `data:image/svg+xml;base64,${window.btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${img.naturalWidth}" height="${img.naturalHeight}"></svg>`
    )}`;

    refState.transparentSpaceFiller = img.src;

    return () => {
      img.style.backgroundImage = originalProperties.backgroundImage;
      img.style.backgroundRepeat = originalProperties.backgroundRepeat;
      img.src = originalProperties.src;
    };
  }, [enableZoom]);

  const handleWheel = (event) => {
    const img = imageRef.current;
    if (!img) {
      return;
    }

    let deltaY = 0;
    if (event.deltaY) {
      // FireFox 17+ (IE9+, Chrome 31+?)
      deltaY = event.deltaY;
    } else if (event.wheelDelta) {
      deltaY = -event.wheelDelta;
    }

    // As far as I know, there is no good cross-browser way to get the cursor position relative to the event target.
    // We have to calculate the target element's position relative to the document, and subtrack that from the
    // cursor's position relative to the document.
    const rect = img.getBoundingClientRect();
    const offsetX = event.pageX - rect.left - window.pageXOffset;
    const offsetY = event.pageY - rect.top - window.pageYOffset;

    // Record the offset between the bg edge and cursor:
    const bgCursorX = offsetX - bgPosX;
    const bgCursorY = offsetY - bgPosY;

    // Use the previous offset to get the percent offset between the bg edge and cursor:
    const bgRatioX = bgCursorX / bgWidth;
    const bgRatioY = bgCursorY / bgHeight;

    // Update the bg size:
    let x = bgPosX;
    let y = bgPosY;
    let bh = bgHeight;
    let bw = bgWidth;

    if (deltaY < 0) {
      bw += bw * zoom;
      bh += bh * zoom;
    } else {
      bw -= bw * zoom;
      bh -= bh * zoom;
    }

    if (maxZoom) {
      bw = Math.min(measuredWidth * maxZoom, bw);
      bh = Math.min(measuredHeight * maxZoom, bh);
    }

    // Take the percent offset and apply it to the new size:
    x = offsetX - bw * bgRatioX;
    y = offsetY - bh * bgRatioY;

    // Prevent zooming out beyond the starting size
    if (bw <= measuredWidth || bh <= measuredHeight) {
      // reset
      bw = measuredWidth;
      bh = measuredHeight;
      x = y = 0;
    }

    setBgWidth(bw);
    setBgHeight(bh);
    setBgPosX(x);
    setBgPosY(y);
    refState.x = x;
    refState.y = y;
  };

  const handleMouseUp = (event) => {
    const { dragging } = refState;
    if (dragging) {
      event.preventDefault();
      event.stopPropagation();

      refState.dragging = false;
      setIsDragging(false);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    }
  };

  const handleMouseDown = (event) => {
    const { dragging, x, y } = refState;
    const zoomedIn = y !== 0 || x !== 0;
    if (!dragging && zoomedIn) {
      refState.previousEvent = { pageX: event.pageX, pageY: event.pageY };
      refState.dragging = true;
      setIsDragging(true);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
    }
  };

  const handleMouseMove = (event) => {
    const { previousEvent, dragging, x, y } = refState;
    if (dragging) {
      event.preventDefault();
      event.stopPropagation();

      refState.x = x + event.pageX - previousEvent.pageX;
      refState.y = y + event.pageY - previousEvent.pageY;
      setBgPosX(refState.x);
      setBgPosY(refState.y);
      refState.previousEvent = { pageX: event.pageX, pageY: event.pageY };
    }
  };

  let x = bgPosX;
  let y = bgPosY;
  if (x > 0) {
    x = 0;
  } else if (x < measuredWidth - bgWidth) {
    x = measuredWidth - bgWidth;
  }

  if (y > 0) {
    y = 0;
  } else if (y < measuredHeight - bgHeight) {
    y = measuredHeight - bgHeight;
  }

  const zoomedIn = y !== 0 || x !== 0;
  let style = {
    backgroundSize: `${bgWidth}px ${bgHeight}px`,
    backgroundPosition: `${x}px ${y}px`,
  };

  if (isDragging) {
    style.cursor = 'grabbing';
  } else if (zoomedIn) {
    style.cursor = 'grab';
  }

  if (other.style) {
    style = { ...style, ...other.style };
  }

  return (
    <motion.img
      ref={imageRef}
      className={clsx(classes.image, styleName)}
      role="presentation"
      src={src}
      alt={title}
      width={width}
      height={height}
      title={title}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      {...other}
      style={style}
      drag={enableZoom && zoomedIn ? '' : other.drag}
    />
  );
};

ImageWithZoom.defaultProps = {
  zoom: 0.1,
  maxZoom: false,
  initialZoom: 1,
  initialX: 0,
  initialY: 0,
  title: '',
  styleName: null,
  enableZoom: false,
};

ImageWithZoom.propTypes = {
  // Required
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,

  // Optional
  zoom: PropTypes.number,
  maxZoom: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  initialZoom: PropTypes.number,
  initialX: PropTypes.number,
  initialY: PropTypes.number,
  enableZoom: PropTypes.bool,
  title: PropTypes.string,
  styleName: PropTypes.string,
};

export default withStyles(styles)(ImageWithZoom);

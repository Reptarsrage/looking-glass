import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  container: {
    position: 'relative',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '10px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#d5d5d5',
      borderRadius: '4px',
    },
  },
});

const withScroll = (WrappedComponent) => {
  const WithScroll = (props) => {
    const { classes, initialScrollTop, width, height, onScroll, ...passThroughProps } = props;

    const outerRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(initialScrollTop || 0);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [scrollDirection, setScrollDirection] = useState(1);

    const handleScroll = (event) => {
      const { clientHeight, scrollTop: cScrollTop, scrollHeight: cScrollHeight } = event.currentTarget;
      if (cScrollTop === scrollTop) {
        return;
      }

      setScrollTop(Math.max(0, Math.min(cScrollTop, cScrollHeight - clientHeight)));
      setScrollDirection(scrollTop < cScrollTop ? 1 : -1);

      // Callback
      if (onScroll) {
        onScroll({ currentTarget: event.currentTarget });
      }
    };

    useEffect(() => {
      // Scroll to initial position on mount
      const outerElt = outerRef.current;
      if (typeof initialScrollTop === 'number') {
        outerElt.scrollTop = initialScrollTop;
      }
    }, []);

    useEffect(() => {
      // Try and maintain relative scroll position when width resized
      const outerElt = outerRef.current;
      if (scrollHeight > 0) {
        const adjustedScrollTop = (scrollTop * outerElt.scrollHeight) / scrollHeight;
        outerElt.scrollTop = adjustedScrollTop;
        setScrollTop(adjustedScrollTop);
      }

      setScrollHeight(outerRef.current.scrollHeight);
    }, [width]);

    return (
      <div
        ref={outerRef}
        className={classes.container}
        style={{ width: `${width}px`, height: `${height}px` }}
        onScroll={handleScroll}
      >
        <WrappedComponent
          {...passThroughProps}
          scrollDirection={scrollDirection}
          scrollTop={scrollTop}
          width={width}
          height={height}
        />
      </div>
    );
  };

  WithScroll.propTypes = {
    initialScrollTop: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onScroll: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };

  return withStyles(styles)(WithScroll);
};

export default withScroll;

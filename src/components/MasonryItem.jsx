import React from 'react';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { useInView } from 'react-intersection-observer';

import { itemByIdSelector } from '../selectors/itemSelectors';
import Image from './Image';
import Video from './Video';

const styles = theme => ({
  paper: {
    padding: 0,
    height: '100%',
    maxHeight: '100%',
    display: 'inline-flex',
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 3,
  },
});

const MasonryItem = props => {
  const [ref, inView] = useInView({
    /* Optional options */
    threshold: 0,
    rootMargin: '500px',
  });

  const handleClick = event => {
    const { onClick, item } = props;
    if (onClick) {
      onClick(event, item);
    }
  };

  const renderImage = () => {
    const { item } = props;
    const { width, height, title, url, thumb } = item;
    return inView ? <Image src={url} thumb={thumb} title={title} width={width} height={height} /> : null;
  };

  const renderVideo = () => {
    const { item } = props;
    const { width, height, title, url, thumb } = item;
    return inView ? (
      <Video src={url} thumb={thumb} title={title} width={width} height={height} muted autoPlay loop />
    ) : null;
  };

  const renderLink = children => {
    const { classes, item, moduleId, itemId } = props;
    const { isGallery } = item;

    if (isGallery) {
      return (
        <Link className={classes.link} to={`/gallery/${moduleId}/${itemId}`}>
          <PhotoLibraryIcon color="primary" className={classes.icon} />
          {children}
        </Link>
      );
    }

    return children;
  };

  const { classes, item } = props;
  const { isVideo } = item;
  return (
    <Paper ref={ref} onClick={handleClick} className={classes.paper}>
      {renderLink(isVideo ? renderVideo() : renderImage())}
    </Paper>
  );
};

MasonryItem.defaultProps = {
  onClick: null,
};

MasonryItem.propTypes = {
  classes: PropTypes.object.isRequired,
  moduleId: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  item: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    isVideo: PropTypes.bool,
    isGallery: PropTypes.bool,
    url: PropTypes.string,
    thumb: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  item: itemByIdSelector,
});

export default compose(connect(mapStateToProps), withStyles(styles))(MasonryItem);

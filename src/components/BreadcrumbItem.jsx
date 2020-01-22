import React from 'react';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { breadcrumbByIdSelector } from '../selectors/breadcrumbSelectors';

const styles = () => ({
  link: {
    display: 'flex',
  },
});

const BreadcrumbItem = ({ breadcrumb, classes, depth, history }) => {
  const handleClick = () => {
    history.go(depth);
  };

  return (
    <Link color="inherit" variant="body1" component="button" onClick={handleClick} className={classes.link}>
      {breadcrumb.title}
    </Link>
  );
};
BreadcrumbItem.propTypes = {
  // required
  // eslint-disable-next-line react/no-unused-prop-types
  breadcrumbId: PropTypes.string.isRequired,

  // selectors
  depth: PropTypes.number.isRequired,
  breadcrumb: PropTypes.shape({
    title: PropTypes.string,
    galleryId: PropTypes.string,
  }).isRequired,

  // withRouter
  history: ReactRouterPropTypes.history.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  breadcrumb: breadcrumbByIdSelector,
});

export default compose(connect(mapStateToProps), withRouter, withStyles(styles))(BreadcrumbItem);

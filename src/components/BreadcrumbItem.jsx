import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';

import * as naviagationActions from '../actions/navigationActions';
import { breadcrumbByIdSelector } from '../selectors/breadcrumbSelectors';

const styles = () => ({
  link: {
    display: 'flex',
  },
});

const BreadcrumbItem = ({ breadcrumbId, breadcrumb, classes, navigateToBreadcrumb }) => {
  const { title } = breadcrumb;
  const handleClick = () => {
    navigateToBreadcrumb(breadcrumbId);
  };

  return (
    <Link color="inherit" variant="body1" component="button" onClick={handleClick} className={classes.link}>
      {title}
    </Link>
  );
};

BreadcrumbItem.propTypes = {
  // required
  breadcrumbId: PropTypes.string.isRequired,

  // actions
  navigateToBreadcrumb: PropTypes.func.isRequired,

  // selectors
  breadcrumb: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    moduleId: PropTypes.string.isRequired,
    galleryId: PropTypes.string.isRequired,
  }).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  breadcrumb: breadcrumbByIdSelector,
});

const mapDispatchToProps = {
  navigateToBreadcrumb: naviagationActions.navigateToBreadcrumb,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(BreadcrumbItem);

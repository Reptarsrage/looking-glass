import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';

import * as naviagationActions from '../actions/navigationActions';
import { breadcrumbsSelector } from '../selectors/breadcrumbSelectors';
import BreadcrumbItem from './BreadcrumbItem';

const styles = theme => ({
  link: {
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
});

const CustomBreadcrumbs = ({ breadcrumbs, classes, navigateHome }) => (
  <Breadcrumbs maxItems={3} aria-label="Breadcrumb">
    <Link key="Home" color="inherit" className={classes.link} onClick={navigateHome}>
      <HomeIcon className={classes.icon} />
      Home
    </Link>
    {breadcrumbs.map(breadcrumbId => (
      <BreadcrumbItem key={breadcrumbId} breadcrumbId={breadcrumbId} />
    ))}
  </Breadcrumbs>
);

CustomBreadcrumbs.propTypes = {
  // selectors
  breadcrumbs: PropTypes.arrayOf(PropTypes.string).isRequired,

  // withStyles
  navigateHome: PropTypes.func.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  breadcrumbs: breadcrumbsSelector,
});

const mapDispatchToProps = {
  navigateHome: naviagationActions.navigateHome,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(CustomBreadcrumbs);

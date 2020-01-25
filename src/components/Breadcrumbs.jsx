import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import { createStructuredSelector } from 'reselect';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';

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

const CustomBreadcrumbs = ({ breadcrumbs, classes }) => (
  <Breadcrumbs maxItems={3} aria-label="Breadcrumb">
    <Link key="Home" color="inherit" to="/" className={classes.link} component={RouterLink}>
      <HomeIcon className={classes.icon} />
      Home
    </Link>
    {breadcrumbs.map((breadcrumbId, i) => (
      <BreadcrumbItem key={breadcrumbId} breadcrumbId={breadcrumbId} depth={i - breadcrumbs.length + 1} />
    ))}
  </Breadcrumbs>
);

CustomBreadcrumbs.propTypes = {
  // selectors
  breadcrumbs: PropTypes.arrayOf(PropTypes.string).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  breadcrumbs: breadcrumbsSelector,
});

export default compose(connect(mapStateToProps), withStyles(styles))(CustomBreadcrumbs);

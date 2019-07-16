import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  link: {
    margin: theme.spacing(1),
  },
});

const NotFound = ({ classes }) => (
  <Fragment>
    <Typography variant="h1">Not Found</Typography>

    <Typography>
      <Link href="/" className={classes.link}>
        Back
      </Link>
    </Typography>
  </Fragment>
);

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFound);

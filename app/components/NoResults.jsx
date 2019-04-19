import React from 'react';
import PropTypes from 'prop-types';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    width: '100%'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const NoResults = ({ classes }) => (
  <div className={classes.wrapper}>
    <div className={classes.row}>
      <Typography align="center" color="textSecondary" noWrap>
        <SentimentDissatisfiedIcon
          style={{ width: '100px', height: '100px' }}
        />
      </Typography>
    </div>
    <div className={classes.row}>
      <Typography align="center" color="textSecondary" noWrap variant="h5">
        No Results
      </Typography>
    </div>
  </div>
);

NoResults.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(NoResults);

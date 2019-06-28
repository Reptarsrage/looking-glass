import React from 'react';
import PropTypes from 'prop-types';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
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
    width: '100%',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AnErrorOccurred = ({ classes }) => (
  <div className={classes.wrapper}>
    <div className={classes.row}>
      <Typography align="center" color="error" noWrap>
        <SentimentVeryDissatisfiedIcon style={{ width: '100px', height: '100px' }} />
      </Typography>
    </div>
    <div className={classes.row}>
      <Typography align="center" color="error" noWrap variant="h5">
        An Error Occurred
      </Typography>
    </div>
  </div>
);

AnErrorOccurred.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AnErrorOccurred);

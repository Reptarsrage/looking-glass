import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from 'react-router';

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  body: {
    margin: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
});

const NotFound = ({ classes }) => {
  const history = useHistory();
  const go = () => {
    history.push('/');
  };

  return (
    <>
      <Typography variant="h1">Not Found</Typography>
      <Typography>
        <Button variant="contained" color="default" className={classes.button} onClick={go}>
          <HomeIcon className={classes.icon} /> Home
        </Button>
      </Typography>
      <Typography className={classes.body} variant="subtitle2">
        Nothing to see here
      </Typography>
    </>
  );
};

NotFound.propTypes = {
  // withStyles
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFound);

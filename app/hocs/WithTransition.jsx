import React from 'react';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  page: {
    width: '100%',
    height: '100%',
  },
});

const WithTransition = Page => {
  const classes = useStyles();
  return props => (
    <Fade appear={true} in={true}>
      <Box className={classes.page}>
        <Page {...props} />
      </Box>
    </Fade>
  );
};

export default WithTransition;

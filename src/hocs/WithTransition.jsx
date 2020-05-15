import React from 'react';
import Fade from '@material-ui/core/Fade';

const WithTransition = (WrappedComponent) => (props) => (
  <Fade appear in>
    <div style={{ width: '100%', height: '100%' }}>
      <WrappedComponent {...props} />
    </div>
  </Fade>
);

export default WithTransition;

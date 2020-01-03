import React from 'react';
import PropTypes from 'prop-types';

const WithRouteParameters = Component => {
  const Sub = props => {
    const { match } = props;
    const { params } = match;
    return <Component {...props} {...params} />;
  };

  Sub.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  };

  return Sub;
};

WithRouteParameters.propTypes = {
  Component: PropTypes.element,
};

export default WithRouteParameters;

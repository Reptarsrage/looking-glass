import React from 'react';
import { useParams } from 'react-router';

const withRouteParameters = (Component) => (props) => <Component {...props} {...useParams()} />;

export default withRouteParameters;

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class About extends PureComponent {
  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    return (
      <Fragment>
        <Typography variant="h1">About</Typography>

        <Button variant="contained" color="primary" onClick={this.goBack}>
          Back
        </Button>
      </Fragment>
    );
  }
}

About.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default About;

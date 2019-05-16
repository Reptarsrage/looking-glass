import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class About extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this); // i think you are missing this
  }

  goBack() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    return (
      <React.Fragment>
        <Typography variant="h1">About</Typography>

        <Button variant="contained" color="primary" onClick={this.goBack}>
          Back
        </Button>
      </React.Fragment>
    );
  }
}

About.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default About;

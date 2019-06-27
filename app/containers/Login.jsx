import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { compose } from 'recompose';
import Avatar from '@material-ui/core/Avatar';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';

import { successSelector, fetchingSelector, errorSelector } from '../selectors/authSelectors';
import { moduleIdSelector } from '../selectors/appSelectors';
import * as authActions from '../actions/authActions';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  progress: {
    top: '50%',
    left: '50%',
    color: 'white',
    position: 'absolute',
    marginLeft: '-12px',
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      rememberMe: false,
      showPassword: false,
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleRememberMeChange = this.handleRememberMeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClickShowPassword() {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  }

  handleRememberMeChange(event) {
    this.setState({ rememberMe: event.target.checked });
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    const { login, moduleId } = this.props;
    const { username, password } = this.state;

    login(moduleId, username, password);
    event.preventDefault();
  }

  render() {
    const { fetching, error, success, classes, moduleId } = this.props;
    const { username, password, rememberMe, showPassword } = this.state;

    if (success) {
      return <Redirect to={`/gallery/${moduleId}/default`} />;
    }

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && <Typography align="center" color="error" />}
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required fullWidth disabled={fetching}>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                id="username"
                type="text"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={this.handleUsernameChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth disabled={fetching} error={error !== null}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete={showPassword ? 'off' : 'current-password'}
                aria-describedby="component-error-text"
                value={password}
                onChange={this.handlePasswordChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText id="component-error-text">
                {error && 'An error occurred. Please check your username and password and try again.'}
              </FormHelperText>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={this.handleRememberMeChange}
                  disabled={fetching}
                />
              }
              label="Remember me"
            />
            <div className={classes.wrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={fetching}
              >
                Sign in
              </Button>
              {fetching && <CircularProgress size={24} className={classes.progress} />}
            </div>
          </form>
        </Paper>
      </main>
    );
  }
}

Login.defaultProps = {
  error: null,
  classes: {},
};

Login.propTypes = {
  moduleId: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
  classes: PropTypes.shape({}),
};

const mapStateToProps = createStructuredSelector({
  success: successSelector(),
  fetching: fetchingSelector(),
  error: errorSelector(),
  moduleId: moduleIdSelector(),
});

const mapDispatchToProps = {
  login: authActions.login,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Login);

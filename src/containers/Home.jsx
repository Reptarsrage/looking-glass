import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      error: null,
      modules: [],
    };
  }

  componentWillMount() {
    this.setState({ fetching: true });
    axios
      .get('http://localhost:3001/')
      .then(({ data }) => {
        this.setState({ modules: data, fetching: false });
      })
      .catch(error => this.setState({ error }));
  }

  render() {
    const { classes } = this.props;
    const { fetching, error, modules } = this.state;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          {fetching && <CircularProgress />}
          {error && <Typography color="error">An Error occurred</Typography>}
          <List>
            {modules.map(m => (
              <ListItem key={m.id} button>
                <ListItemAvatar>
                  <Avatar alt={m.title} src={m.icon} />
                </ListItemAvatar>
                <ListItemText primary={m.title} secondary={m.description} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </main>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);

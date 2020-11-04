import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import HomeIcon from '@material-ui/icons/Home'
import { Link } from 'react-router-dom'

const styles = (theme) => ({
  body: {
    margin: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
})

const NotFound = ({ classes }) => {
  return (
    <>
      <Typography variant="h1">Not Found</Typography>
      <Typography>
        <Link>
          <HomeIcon className={classes.icon} /> Home
        </Link>
      </Typography>
      <Typography className={classes.body} variant="subtitle2">
        Nothing to see here
      </Typography>
    </>
  )
}

NotFound.propTypes = {
  // withStyles
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(NotFound)

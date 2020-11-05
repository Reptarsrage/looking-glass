import React from 'react'
import PropTypes from 'prop-types'
import Link from '@material-ui/core/Link'
import { withStyles } from '@material-ui/core/styles'
import { useHistory, useLocation } from 'react-router-dom'

const styles = () => ({
  link: {
    display: 'flex',
  },
})

const BreadcrumbItem = ({ title, classes, url }) => {
  const history = useHistory()
  const location = useLocation()

  const handleClick = () => {
    if (location.pathname === url) {
      // TODO: Scroll to top maybe?
    } else {
      history.push(url)
    }
  }

  return (
    <Link color="inherit" variant="body1" component="button" onClick={handleClick} className={classes.link}>
      {title}
    </Link>
  )
}

BreadcrumbItem.propTypes = {
  // required
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(BreadcrumbItem)

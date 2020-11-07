import React from 'react'
import PropTypes from 'prop-types'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles(() => ({
  link: {
    display: 'flex',
  },
}))

export default function BreadcrumbItem({ title, url }) {
  const classes = useStyles()

  // TODO: Scroll to top when user clicks on current link
  return (
    <Link component={RouterLink} color="inherit" to={url} className={classes.link}>
      {title}
    </Link>
  )
}

BreadcrumbItem.propTypes = {
  // required
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

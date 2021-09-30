import React from 'react'
import PropTypes from 'prop-types'
import Link from '@mui/material/Link'
import { makeStyles } from '@mui/styles'
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    color: theme.palette.text.main,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))

export default function BreadcrumbItem({ name, url }) {
  const classes = useStyles()

  // TODO: Scroll to top when user clicks on current link
  return (
    <Link component={RouterLink} color="inherit" to={url} className={classes.link}>
      {name}
    </Link>
  )
}

BreadcrumbItem.propTypes = {
  // required
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

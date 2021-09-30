import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import HomeIcon from '@mui/icons-material/Home'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { makeStyles } from '@mui/styles'
import { Link as RouterLink } from 'react-router-dom'

import { breadcrumbsSelector } from 'selectors/breadcrumbSelectors'
import BreadcrumbItem from './BreadcrumbItem'

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    cursor: 'pointer',
    color: theme.palette.text.main,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
}))

export default function CustomBreadcrumbs({ galleryId }) {
  const classes = useStyles()
  const breadcrumbs = useSelector((state) => breadcrumbsSelector(state, { galleryId }))

  return (
    <Breadcrumbs maxItems={3} aria-label="Breadcrumb">
      <Link component={RouterLink} to="/" key="Home" color="inherit" className={classes.link}>
        <HomeIcon className={classes.icon} />
        Home
      </Link>
      {breadcrumbs.map(({ id, name, url }) => (
        <BreadcrumbItem key={id} name={name} url={url} />
      ))}
    </Breadcrumbs>
  )
}

CustomBreadcrumbs.propTypes = {
  // required
  galleryId: PropTypes.string.isRequired,
}

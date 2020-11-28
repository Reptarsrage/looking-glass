import React from 'react'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import HomeIcon from '@material-ui/icons/Home'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'

import { breadcrumbsSelector } from 'selectors/breadcrumbSelectors'
import BreadcrumbItem from './BreadcrumbItem'

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    cursor: 'pointer',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
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

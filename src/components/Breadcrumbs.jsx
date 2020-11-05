import React from 'react'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import HomeIcon from '@material-ui/icons/Home'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { useHistory } from 'react-router-dom'

import { breadcrumbsSelector } from 'selectors/breadcrumbSelectors'
import BreadcrumbItem from './BreadcrumbItem'

const styles = (theme) => ({
  link: {
    display: 'flex',
    cursor: 'pointer',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
})

const CustomBreadcrumbs = ({ breadcrumbs, classes }) => {
  const history = useHistory()
  const navigateHome = () => {
    history.push('/')
  }

  return (
    <Breadcrumbs maxItems={3} aria-label="Breadcrumb">
      <Link key="Home" color="inherit" className={classes.link} onClick={navigateHome}>
        <HomeIcon className={classes.icon} />
        Home
      </Link>
      {breadcrumbs.map(({ id, title, url }) => (
        <BreadcrumbItem key={id} title={title} url={url} />
      ))}
    </Breadcrumbs>
  )
}

CustomBreadcrumbs.propTypes = {
  // required
  // eslint-disable-next-line react/no-unused-prop-types
  galleryId: PropTypes.string.isRequired,

  // selectors
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = createStructuredSelector({
  breadcrumbs: breadcrumbsSelector,
})

export default compose(connect(mapStateToProps), withStyles(styles))(CustomBreadcrumbs)

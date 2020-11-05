import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import InputBase from '@material-ui/core/InputBase'
import { fade } from '@material-ui/core/styles/colorManipulator'
import SearchIcon from '@material-ui/icons/Search'

import { currentSearchQuerySelector } from 'selectors/gallerySelectors'
import * as galleryActions from 'actions/galleryActions'

const styles = (theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
})

const SearchBar = ({ searchChange, classes, moduleId, galleryId, searchQuery }) => {
  const handleSearchChange = (e) => {
    searchChange(galleryId, e.target.value)
  }

  if (!moduleId || !galleryId) {
    return null
  }

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        onChange={handleSearchChange}
        value={searchQuery || ''}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
      />
    </div>
  )
}

SearchBar.defaultProps = {
  moduleId: null,
  galleryId: null,
  searchQuery: null,
}

SearchBar.propTypes = {
  // required
  moduleId: PropTypes.string,
  galleryId: PropTypes.string,

  // actions
  searchChange: PropTypes.func.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,

  // selectors
  searchQuery: PropTypes.string,
}

const mapStateToProps = createStructuredSelector({
  searchQuery: currentSearchQuerySelector,
})

const mapDispatchToProps = {
  searchChange: galleryActions.searchChange,
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(SearchBar)

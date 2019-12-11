import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';

import { moduleIdSelector } from '../selectors/appSelectors';
import { searchQuerySelector, searchGalleryIdSelector } from '../selectors/moduleSelectors';
import * as moduleActions from '../actions/moduleActions';

const styles = theme => ({
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
      marginLeft: theme.spacing(3),
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
});

class SearchBar extends Component {
  handleSearchChange = e => {
    const { updateSearch, moduleId, galleryId } = this.props;
    updateSearch(e.target.value, moduleId, galleryId);
  };

  render() {
    const { classes, moduleId, galleryId, searchQuery } = this.props;

    if (!moduleId || !galleryId) {
      // TODO: render only when on default or search gallery
      return null;
    }

    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          onChange={this.handleSearchChange}
          value={searchQuery || ''}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
        />
      </div>
    );
  }
}

SearchBar.defaultProps = {
  moduleId: null,
  galleryId: null,
  searchQuery: null,
};

SearchBar.propTypes = {
  updateSearch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  moduleId: PropTypes.string,
  galleryId: PropTypes.string,
  searchQuery: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  moduleId: moduleIdSelector,
  galleryId: searchGalleryIdSelector,
  searchQuery: searchQuerySelector,
});

const mapDispatchToProps = {
  updateSearch: moduleActions.updateSearch,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(SearchBar);

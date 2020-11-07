import React from 'react'
import PropTypes from 'prop-types'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(1),
  },
  iconButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}))

export default function BackButton({ color, isFab }) {
  const classes = useStyles()
  const history = useHistory()

  const navigateBack = () => {
    history.goBack()
  }

  if (isFab) {
    return (
      <Fab color={color} aria-label="Back" className={isFab ? classes.fab : classes.iconButton} onClick={navigateBack}>
        <ArrowBackIcon />
      </Fab>
    )
  }

  return (
    <IconButton
      color={color}
      aria-label="Back"
      className={isFab ? classes.fab : classes.iconButton}
      onClick={navigateBack}
    >
      <ArrowBackIcon />
    </IconButton>
  )
}

BackButton.defaultProps = {
  color: 'default',
  isFab: true,
}

BackButton.propTypes = {
  // optional
  color: PropTypes.string,
  isFab: PropTypes.bool,
}

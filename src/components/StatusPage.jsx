import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles((theme) => ({
  page: {
    flex: '1 1 100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: '500px',
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  svg: {
    fill: theme.palette.primary.main,
    width: 'auto',
    height: '500px',
  },
}))

function StatusPage({ message, children }) {
  const classes = useStyles()
  const childrenWithClass = React.cloneElement(children, { className: classes.svg })

  return (
    <div className={classes.page}>
      <div className={classes.img}>{childrenWithClass}</div>
      <Typography align="center" noWrap variant="h2">
        {message}
      </Typography>
    </div>
  )
}

StatusPage.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.string.isRequired,
}

export default StatusPage

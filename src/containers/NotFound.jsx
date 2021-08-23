import React from 'react'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import HomeIcon from '@material-ui/icons/Home'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  body: {
    margin: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
}))

export default function NotFound() {
  const classes = useStyles()

  return (
    <>
      <Typography variant="h1">Not Found</Typography>
      <Typography>
        <Link component={RouterLink} to="/">
          <HomeIcon className={classes.icon} /> Home
        </Link>
      </Typography>
      <Typography className={classes.body} variant="subtitle2">
        Nothing to see here
      </Typography>
    </>
  )
}

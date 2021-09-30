import React from 'react'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import HomeIcon from '@mui/icons-material/Home'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@mui/styles'

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

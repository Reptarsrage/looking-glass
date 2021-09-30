import React from 'react'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export default function NoResults() {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <div className={classes.row}>
        <Typography align="center" color="textSecondary" noWrap>
          <SentimentDissatisfiedIcon style={{ width: '100px', height: '100px' }} />
        </Typography>
      </div>
      <div className={classes.row}>
        <Typography align="center" color="textSecondary" noWrap variant="h5">
          No Results
        </Typography>
      </div>
    </div>
  )
}

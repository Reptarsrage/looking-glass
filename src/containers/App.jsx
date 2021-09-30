import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Container from '@mui/material/Container'

import Progress from 'components/Progress'
import TitleBar from 'components/TitleBar'
import withTheme from 'hocs/WithTheme'

const useStyles = makeStyles(() => ({
  container: {
    flex: '1 1 auto',
    display: 'flex !important',
    flexDirection: 'column',
    overflow: 'hidden',
    marginTop: '72px',
  },
}))

function App({ children }) {
  const classes = useStyles()

  return (
    <>
      <TitleBar />
      <Progress />
      <Container maxWidth={false} className={classes.container}>
        {children}
      </Container>
    </>
  )
}

App.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default withTheme(App)

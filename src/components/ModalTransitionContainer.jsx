import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { makeStyles } from '@material-ui/styles'

import SlideShow from './SlideShow'

const useStyles = makeStyles((theme) => ({
  modal: {
    top: '30px', // titleBar height
    position: 'fixed',
    zIndex: theme.zIndex.drawer + 2,
    background: 'transparent',
  },
}))

export default function ModalContainer({ initial, animating, onAnimationStart, onAnimationComplete }) {
  const classes = useStyles()

  return (
    <motion.div
      initial={initial}
      animate={{ top: '30px', left: 0, width: '100%', height: 'calc(100% - 30px)' }}
      exit={initial}
      transition={{ duration: 0.2 }}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
      className={classes.modal}
    >
      <SlideShow animating={animating} />
    </motion.div>
  )
}

ModalContainer.propTypes = {
  // required
  onAnimationStart: PropTypes.func.isRequired,
  onAnimationComplete: PropTypes.func.isRequired,
  initial: PropTypes.object.isRequired,
  animating: PropTypes.bool.isRequired,
}

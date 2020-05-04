import React from 'react';
import { withStyles } from '@material-ui/styles';
import { CSSTransition } from 'react-transition-group';
import { Spin } from 'antd';

const TRANSITION_TIME = 100; // milliseconds

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, .2)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationEnter: {
    opacity: 0,
  },
  animationEnterActive: {
    opacity: 1,
    transition: `all ${TRANSITION_TIME}ms`,
    transitionTimingFunction: 'cubic-bezier(0.65, 0.05, 0.36, 1)',
  },
  animationExit: {
    opacity: 1,
  },
  animationExitActive: {
    opacity: 0,
    transition: `all ${TRANSITION_TIME}ms`,
    transitionTimingFunction: 'cubic-bezier(0.65, 0.05, 0.36, 1)',
  },
};

const LoaderOverlay = ({ classes, show }) => (
  <CSSTransition
    in={show}
    timeout={TRANSITION_TIME}
    classNames={{
      enter: classes.animationEnter,
      enterActive: classes.animationEnterActive,
      exit: classes.animationExit,
      exitActive: classes.animationExitActive,
    }}
    unmountOnExit
  >
    <div className={classes.container}>
      <Spin size="large" />
    </div>
  </CSSTransition>
);

export default withStyles(styles)(LoaderOverlay);

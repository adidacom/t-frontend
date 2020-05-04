import React from 'react';
import { withStyles } from '@material-ui/styles';
import { CSSTransition } from 'react-transition-group';
import ReactPlayer from 'react-player';
import { COLORS } from '../utils/theme';

const TRANSITION_TIME = 200; // milliseconds

const CYBERSECURITY_INTRO_VIDEO_URL =
  'https://d3cg1b33ii49pi.cloudfront.net/intro_videos/t4_cybersecurity_intro_9_9_2019.mp4';
const ESPORTS_INTRO_VIDEO_URL =
  'https://d3cg1b33ii49pi.cloudfront.net/intro_videos/t4_esports_intro_9_9_2019.mp4';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18px 60px 0px 60px',
    borderRadius: 4,
    background: COLORS.BASIC100,
  },
  header: {
    fontSize: 26,
    fontWeight: 700,
    color: COLORS.BASIC800,
    marginBottom: 18,
  },
  next: {
    fontSize: 13,
    marginTop: 18,
    userSelect: 'none',
    cursor: 'pointer',
    transition: 'all 0.18s ease-out',
    color: COLORS.BASIC600,
    '&:hover': {
      color: COLORS.BASIC800,
    },
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

const getVideoFromIndustry = (industry) => {
  switch (industry) {
    case 'cybersecurity':
      return CYBERSECURITY_INTRO_VIDEO_URL;
    case 'eSports':
      return ESPORTS_INTRO_VIDEO_URL;
    default:
      return CYBERSECURITY_INTRO_VIDEO_URL;
  }
};

const WelcomeModal = ({
  classes,
  show,
  firstName,
  industry,
  onProgress,
  onEnded,
  onButtonClick,
}) => (
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
      <div className={classes.content}>
        <div className={classes.header}>{`${firstName}, welcome to T4!`}</div>
        <ReactPlayer
          url={getVideoFromIndustry(industry)}
          playing
          muted
          controls
          style={{ border: `1px ${COLORS.BASIC400} solid` }}
          width={772}
          height={450}
          config={{
            file: { attributes: { controlsList: 'nodownload', disablePictureInPicture: true } },
          }}
          onProgress={onProgress}
          onEnded={onEnded}
        />
        <div className={classes.next} onClick={onButtonClick}>
          NEXT &gt;
        </div>
      </div>
    </div>
  </CSSTransition>
);

export default withStyles(styles)(WelcomeModal);

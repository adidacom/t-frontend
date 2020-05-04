import React, { useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Popover } from 'antd';
import { COLORS } from '../../utils/theme';
import { updateProfile } from '../../redux';
import HeaderMenu from './HeaderMenu';
import WelcomeModal from '../WelcomeModal';
import logo from '../../assets/logo_header.png';
import { getLastElement } from '../../utils/tools';
import * as AnalyticsService from '../../utils/analytics';

const SHOW_VIDEO_PREFERENCE_KEY = 'showIntroVideoV0_2';

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  leftSection: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    height: 40,
  },
  rightSection: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  userIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    background: COLORS.BASIC300,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 400,
    lineHeight: '40px',
    userSelect: 'none',
  },
};

let secondsVideoPlayed = 0;

const getInitialsFromUser = (user) =>
  `${user.firstName ? user.firstName[0] : ''}${user.lastName ? user.lastName[0] : ''}`;

const Header = ({ classes, userReducer, updateUserPreferences }) => {
  const userPreferences = userReducer.preferences;
  const [showIntroVideo, setShowIntroVideo] = useState(
    userPreferences[SHOW_VIDEO_PREFERENCE_KEY] !== false,
  );

  const handleOnVideoProgress = (event) => {
    secondsVideoPlayed = event.playedSeconds.toFixed(1);
  };

  const handleVideoNextButtonClicked = () => {
    setShowIntroVideo(false);
    updateUserPreferences({ [SHOW_VIDEO_PREFERENCE_KEY]: false });
    AnalyticsService.trackIntroVideoView(secondsVideoPlayed);
  };

  const handleMenuWatchVideoClick = () => {
    setShowIntroVideo(true);
  };

  return (
    <div className={classes.container}>
      <WelcomeModal
        show={showIntroVideo}
        industry={getLastElement(userReducer.industriesEnabled[0])}
        firstName={userReducer.firstName}
        onProgress={handleOnVideoProgress}
        onButtonClick={handleVideoNextButtonClicked}
      />
      <div className={classes.leftSection}>
        <Link to="/search">
          <img className={classes.logo} src={logo} alt="T4 Logo" />
        </Link>
      </div>
      <div className={classes.rightSection}>
        <Popover
          content={<HeaderMenu onWatchVideoClick={handleMenuWatchVideoClick} />}
          placement="bottomRight"
        >
          <div className={classes.userIconWrapper}>{getInitialsFromUser(userReducer)}</div>
        </Popover>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userReducer: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  updateUserPreferences: (payload) => dispatch(updateProfile({ preferences: payload })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Header));

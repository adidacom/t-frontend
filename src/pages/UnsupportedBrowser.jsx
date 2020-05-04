import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import { Icon } from 'antd';
import { COLORS } from '../utils/theme';
import * as AnalyticsService from '../utils/analytics';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '20vh',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginTop: 24,
    color: COLORS.BASIC700,
    textAlign: 'center',
  },
};

const UnsupportedBrowser = ({ classes }) => {
  useEffect(() => {
    AnalyticsService.trackVisitUnsupportedBrowserPage();
    AnalyticsService.gaTrackPageVisit();
  }, []);
  return (
    <div className={classes.container}>
      <Icon type="message" style={{ fontSize: 48, color: COLORS.BASIC700 }} />
      <h1 className={classes.title}>
        T4 currently only supports Google Chrome.
        <br />
        Your browser will be supported soon!
      </h1>
    </div>
  );
};

export default withStyles(styles)(UnsupportedBrowser);

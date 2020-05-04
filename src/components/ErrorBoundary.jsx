import React from 'react';
import * as Sentry from '@sentry/browser';
import { withStyles } from '@material-ui/styles';
import { Icon } from 'antd';
import { COLORS } from '../utils/theme';

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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch = (error, errorInfo) => {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
  };

  render() {
    const { classes } = this.props;

    if (this.state.hasError) {
      setTimeout(() => window.location.assign('/'), 1500);

      return (
        <div className={classes.container}>
          <Icon type="experiment" style={{ fontSize: 48, color: COLORS.BASIC700 }} />
          <h1 className={classes.title}>Retabulating...</h1>
        </div>
      );
    }
    return this.props.children;
  }
}

export default withStyles(styles)(ErrorBoundary);

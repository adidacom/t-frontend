import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { setUserError, changePassword } from '../../redux';
import { COLORS } from '../../utils/theme';
import { checkPasswordStrength } from '../../utils/tools';
import Button from '../../components/common/Button';
import LoaderOverlay from '../../components/LoaderOverlay';
import * as AnalyticsService from '../../utils/analytics';

const styles = {
  container: {
    width: '100%',
    margin: '14px 24px',
  },
  header: {
    fontSize: 26,
    fontWeight: 700,
    color: COLORS.PRIMARY500,
    height: 50,
    margin: 0,
    padding: 0,
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 500,
    color: COLORS.INFO600,
    paddingTop: 7,
    paddingLeft: 20,
    paddingRight: 30,
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    width: 240,
  },
  input: {
    width: '100%',
    padding: '10px 16px',
    marginBottom: 14,
    background: COLORS.BASIC200,
    border: `1px ${COLORS.BASIC400} solid`,
    borderRadius: 4,
    fontSize: '15px',
    fontWeight: 500,
    textAlign: 'center',
    color: COLORS.BASIC800,
    transition: 'height 0.1s ease-out',
    position: 'relative',
    '&:hover': {
      background: COLORS.BASIC300,
    },
    '&:focus': {
      background: COLORS.BASIC100,
      border: `1px ${COLORS.PRIMARY500} solid`,
      outline: 'none',
    },
    '&::placeholder': {
      fontWeight: 400,
      color: COLORS.BASIC600,
    },
  },
  info: {
    color: COLORS.INFO700,
    marginTop: 10,
  },
  error: {
    color: COLORS.DANGER900,
    marginTop: 10,
  },
  gap10: {
    height: 10,
  },
};

const SettingsSecurityContent = ({
  classes,
  apiReducer,
  userReducer,
  setError,
  changeUserPassword,
}) => {
  const isLoading = apiReducer.loading;
  const { email, error } = userReducer;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [submitButtonPressed, setSubmitButtonPressed] = useState(false);

  const showSuccess = !isLoading && !error && submitButtonPressed;

  const handlePasswordChangeSubmit = () => {
    const passwordCheck = checkPasswordStrength(newPassword);
    if (!passwordCheck.strong) {
      setError(passwordCheck.errors[0]);
      return;
    }
    if (newPassword !== newPassword2) {
      setError('Your passwords do not match');
      return;
    }

    changeUserPassword({
      oldPassword,
      newPassword,
    });

    setSubmitButtonPressed(true);
  };

  useEffect(() => {
    setError();
  }, []);

  useEffect(() => {
    AnalyticsService.trackVisitSettingsAccountSecurityPage();
    AnalyticsService.gaTrackPageVisit();
  }, []);

  return (
    <div className={classes.container}>
      <Helmet>
        <title>T4 | Help</title>
        <link rel="canonical" href="https://app.t4.ai/settings" />
      </Helmet>
      <LoaderOverlay show={isLoading} />
      <h1 className={classes.header}>Security Settings</h1>
      <div className={classes.section}>
        <div className={classes.sectionContent}>
          <form>
            <input
              type="email"
              name="email"
              placeholder="email"
              autoComplete="email"
              value={email}
              readOnly
              hidden
            />
            <input
              type="password"
              className={classes.input}
              autoComplete="current-password"
              placeholder="Old password"
              onChange={(event) => setOldPassword(event.target.value)}
              value={oldPassword}
            />
            <input
              type="password"
              className={classes.input}
              autoComplete="new-password"
              placeholder="New password"
              onChange={(event) => setNewPassword(event.target.value)}
              value={newPassword}
            />
            <input
              type="password"
              className={classes.input}
              autoComplete="new-password"
              placeholder="Confirm new password"
              onChange={(event) => setNewPassword2(event.target.value)}
              value={newPassword2}
            />
          </form>
          <div className={classes.gap10} />
          <Button label="Change Password" onClick={handlePasswordChangeSubmit} />
          {!!error && <div className={classes.error}>{error}</div>}
          {showSuccess && <div className={classes.info}>Your password has been updated</div>}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  apiReducer: state.api,
  userReducer: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  changeUserPassword: (payload) => dispatch(changePassword(payload)),
  setError: (payload) => dispatch(setUserError(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(SettingsSecurityContent));

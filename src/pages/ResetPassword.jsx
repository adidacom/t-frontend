import React from 'react';
import { Redirect } from 'react-router-dom';
import { Box, Button, Image, Heading, Text, Anchor } from 'grommet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import qs from 'qs';
import {
  loginError,
  setUserError,
  startResetPassword,
  checkResetPasswordToken,
  resetPassword,
  setResetPasswordTokenValid,
} from '../redux';
import EntryContainer from '../components/EntryContainer';
import LoaderOverlay from '../components/LoaderOverlay';
import { LoginTextInput, loginErrorTextStyle } from '../utils/theme';
import { validateEmail, checkPasswordStrength } from '../utils/tools';
import { isUserAuthorized } from '../utils/auth';
import * as AnalyticsService from '../utils/analytics';
import logo from '../assets/logo_blue_grad.png';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    const queryParams = qs.parse(window.location.search.slice(1));
    const resetPasswordToken = queryParams.token || '';

    this.state = {
      email: '',
      password: '',
      resetPasswordToken,
      emailFormSubmitted: false,
      newPasswordFormSubmitted: false,
    };

    AnalyticsService.trackVisitResetPasswordPage();
    AnalyticsService.gaTrackPageVisit();
  }

  componentDidMount = () => {
    const { resetPasswordToken } = this.state;
    this.props.setUserError(null);

    if (resetPasswordToken) {
      this.props.checkResetPasswordToken(resetPasswordToken);
    }
  };

  handleInputChange = (event) => {
    const { target } = event;
    this.setState({ [target.name]: target.value });
  };

  handleSubmitEmailForm = (event) => {
    event.preventDefault();

    const { email } = this.state;
    // Validate form
    if (!validateEmail(email.trim().toLowerCase())) {
      this.props.setUserError('Please enter a valid email');
      return;
    }

    this.props.startResetPassword(email.trim().toLowerCase());
    this.setState({
      emailFormSubmitted: true,
    });
  };

  handleSubmitNewPasswordForm = (event) => {
    event.preventDefault();

    const { resetPasswordToken, email, password } = this.state;
    const { resetTokenValid } = this.props.user;

    if (resetTokenValid) {
      // Validate form
      if (!validateEmail(email.trim().toLowerCase())) {
        this.props.setUserError('Please enter a valid email');
        return;
      }

      const passwordCheck = checkPasswordStrength(password);
      if (!passwordCheck.strong) {
        this.props.setUserError(passwordCheck.errors[0]);
        return;
      }

      this.props.resetPassword({
        email: email.trim().toLowerCase(),
        password,
        token: resetPasswordToken,
      });

      this.setState({
        newPasswordFormSubmitted: true,
      });
    }
  };

  renderEmailSubmissionForm = () => {
    const formError = this.props.user.error;
    const { email, emailFormSubmitted } = this.state;

    if (emailFormSubmitted && !formError && !this.props.api.loading) {
      return (
        <Box direction="column" alignSelf="start" textAlign="start" ngap="medium">
          <Text size="medium">Please check your email for instructions</Text>
        </Box>
      );
    }

    if (formError === 'Please complete your account') {
      this.props.loginError('Please complete your account');
      return <Redirect to={`/signup?u=${encodeURIComponent(email)}`} />;
    }

    return (
      <form className="full--width" onSubmit={this.handleSubmitEmailForm}>
        <Box direction="column" gap="medium">
          <Box direction="column" align="center" margin={{ top: 'medium', bottom: 'large' }}>
            <LoginTextInput
              name="email"
              placeholder="Enter email"
              type="text"
              value={email}
              onChange={this.handleInputChange}
              autoComplete="email"
            />
          </Box>
          <Box
            margin={{ top: 'xsmall' }}
            width="150px"
            elevation="xlarge"
            round="4px"
            alignSelf="start"
          >
            <Button label="Submit" type="submit" primary fill />
            {formError && (
              <Text size="small" weight="bold" style={loginErrorTextStyle} color="status-error">
                {formError}
              </Text>
            )}
          </Box>
        </Box>
      </form>
    );
  };

  renderResetPasswordForm = () => {
    const formError = this.props.user.error;
    const { email, password, newPasswordFormSubmitted } = this.state;

    if (newPasswordFormSubmitted && !formError && !this.props.api.loading) {
      return (
        <Box direction="column" alignSelf="start" textAlign="start" ngap="medium">
          <Text size="medium">Your password has been reset</Text>
        </Box>
      );
    }

    return (
      <form className="full--width" onSubmit={this.handleSubmitNewPasswordForm}>
        <Box direction="column" gap="medium">
          <Box
            direction="column"
            align="center"
            margin={{ top: 'medium', bottom: 'large' }}
            gap="small"
          >
            <LoginTextInput
              name="email"
              placeholder="Enter email"
              type="text"
              value={email}
              onChange={this.handleInputChange}
              autoComplete="email"
            />
            <LoginTextInput
              name="password"
              placeholder="Enter new password"
              type="password"
              value={password}
              onChange={this.handleInputChange}
              autoComplete="new-password"
            />
          </Box>
          <Box
            margin={{ top: 'xsmall' }}
            width="150px"
            elevation="xlarge"
            round="4px"
            alignSelf="start"
          >
            <Button label="Submit" type="submit" primary fill />
            {formError && (
              <Text size="small" weight="bold" style={loginErrorTextStyle} color="status-error">
                {formError}
              </Text>
            )}
          </Box>
        </Box>
      </form>
    );
  };

  render() {
    const { api, auth, user } = this.props;
    const showResetPasswordForm = user.resetTokenValid;

    if (isUserAuthorized(auth.authState)) {
      return <Redirect to="/" />;
    }

    return (
      <EntryContainer>
        <Helmet>
          <title>T4 | Reset Password</title>
          <link rel="canonical" href="https://app.t4.ai/resetpassword" />
        </Helmet>
        <LoaderOverlay show={api.loading} />
        <Box direction="column" align="center" gap="small" pad={{ horizontal: 'medium' }}>
          <Image src={logo} width="90px" />
          <Heading level="1" size="small" textAlign="center">
            Reset Password
          </Heading>
        </Box>
        {showResetPasswordForm ? this.renderResetPasswordForm() : this.renderEmailSubmissionForm()}
        <Box gap="small" margin={{ vertical: 'medium' }} alignSelf="start">
          <Text size="small">
            <Anchor label="Back to login" onClick={() => this.props.history.push('/login')} />
          </Text>
        </Box>
      </EntryContainer>
    );
  }
}

export default connect(
  (state) => ({
    api: state.api,
    auth: state.auth,
    user: state.user,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        loginError,
        setUserError,
        startResetPassword,
        checkResetPasswordToken,
        resetPassword,
        setResetPasswordTokenValid,
      },
      dispatch,
    ),
)(ResetPassword);

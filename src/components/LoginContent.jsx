import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Box, Heading, Text, CheckBox, Anchor } from 'grommet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import qs from 'qs';
import { login, loginError } from '../redux';
import { isUserLoggedIn, isUserAuthorized } from '../utils/auth';
import { /*LoginTextInput, */ loginErrorTextStyle } from '../utils/theme';
import Button from './common/Button';
import TextInput from './common/TextInput';
import * as AnalyticsService from '../utils/analytics';

class LoginContent extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Bring all qs parsing to here
    const queryParams = qs.parse(window.location.search.slice(1));
    const email = queryParams.u || '';

    this.state = {
      email,
      password: '',
      rememberMe: true,
    };

    this.props.loginError(null);

    AnalyticsService.trackVisitLoginPage();
    AnalyticsService.gaTrackPageVisit();
  }

  handleInputChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ [target.name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { email, password, rememberMe } = this.state;
    this.props.login({
      email: email.trim().toLowerCase(),
      password,
      rememberMe,
    });
  };

  render() {
    const { email, password, rememberMe } = this.state;
    const { auth, user } = this.props;
    const formError = this.props.auth.loginError || '';
    if (formError === 'Please complete your account') {
      return <Redirect to={`/signup?u=${encodeURIComponent(email)}`} />;
    }

    // TODO: Refactor functionality below
    const queryParams = qs.parse(window.location.search.slice(1));
    const emailVerificationToken = queryParams.verificationToken || '';

    if (isUserAuthorized(auth.authState) && (!emailVerificationToken || user.emailVerified)) {
      return <Redirect to={{ pathname: '/search', search: window.location.search }} />;
    }

    if (isUserLoggedIn(auth.authState)) {
      return (
        <Redirect
          to={{
            pathname: '/signup',
            search: window.location.search,
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <Box
          direction="column"
          align="center"
          margin={{ bottom: 'medium' }}
          gap="medium"
          pad={{ horizontal: 'medium' }}
        >
          <Text textAlign="center" weight="bold" size="xxlarge" color="#222B45">
            Log in to T4
          </Text>
          <Heading level="5" size="small" textAlign="center">
            Log in to find market research in seconds
          </Heading>
        </Box>
        <form className="full--width" onSubmit={this.handleSubmit}>
          <Box direction="column" gap="medium">
            <Box direction="column" align="center" gap="small">
              <TextInput
                name="email"
                placeholder="Enter email"
                type="text"
                value={email}
                onChange={this.handleInputChange}
                autoComplete="email"
              />
              <TextInput
                name="password"
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={this.handleInputChange}
                autoComplete="current-password"
              />
            </Box>
            <Box margin={{ horizontal: '80px' }} align="start" gap="small">
              <Text size="small">
                <Anchor
                  label="Forgot password?"
                  onClick={() => this.props.history.push('/resetpassword')}
                />
              </Text>
            </Box>
            <Box margin={{ horizontal: '80px' }}>
              <CheckBox
                className="zero-height"
                name="rememberMe"
                label="Remember me"
                checked={rememberMe}
                onChange={this.handleInputChange}
              />
            </Box>
            <Box margin={{ top: 'xsmall' }} align="center" round="4px">
              <Button label="Log in" type="submit" variant="primary" />
              {formError && (
                <Text size="small" weight="bold" style={loginErrorTextStyle} color="status-error">
                  {formError}
                </Text>
              )}
            </Box>
          </Box>
        </form>
      </React.Fragment>
    );
  }
}

export default connect(
  (state) => ({
    auth: state.auth,
    user: state.user,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        login,
        loginError,
      },
      dispatch,
    ),
)(withRouter(LoginContent));

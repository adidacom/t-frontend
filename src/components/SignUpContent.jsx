import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Box, Image, Text, CheckBox, Anchor } from 'grommet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import qs from 'qs';
import phone from 'phone';
import {
  signUp,
  signUpAndUpdateProfile,
  resendVerificationEmail,
  verifyEmail,
  logout,
  updateProfile,
  setUserError,
} from '../redux';
import SignUpSelect from './SearchSelect/SignUpSelect';
import { isUserLoggedIn, isProfileComplete } from '../utils/auth';
import { validateEmail, checkPasswordStrength } from '../utils/tools';
import LoaderOverlay from './LoaderOverlay';
import { loginErrorTextStyle } from '../utils/theme';
import Button from './common/Button';
import TextInput from './common/TextInput';
import * as AnalyticsService from '../utils/analytics';
import t4Gif from '../assets/t4_no_loop.gif';

const EMAIL_STAGE = 'EMAIL_STAGE';
const PROFILE_STAGE = 'PROFILE_STAGE';
const VERIFY_EMAIL_STAGE = 'VERIFY_EMAIL_STAGE';

class SignUpContent extends React.Component {
  constructor(props) {
    super(props);

    const queryParams = qs.parse(window.location.search.slice(1));
    const email = queryParams.u || '';
    const accessCode = queryParams.accessCode || '';
    const emailVerificationToken = queryParams.verificationToken || '';

    // TODO: FIX THIS BANDAID!
    if (this.props.auth.loginError === 'Please complete your account') {
      props.setUserError('Please complete your account');
    } else {
      props.setUserError(null);
    }

    const { authState } = props.auth;

    if (isUserLoggedIn(authState) && !props.user.emailVerified && emailVerificationToken) {
      this.props.verifyEmail(emailVerificationToken);
    }

    const authEmailMatchesQueryEmail = props.user.email === email;
    const showingEmailAndProfileStageMixed =
      !!email && (!isUserLoggedIn(authState) || !authEmailMatchesQueryEmail);

    this.state = {
      email,
      password: '',
      rememberMe: true,
      agreeToTerms: false,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      industryProduct: '',
      accessCode,
      showingEmailAndProfileStageMixed,
      // resendVerificationEmailClicked: false,
      emailVerificationToken,
      showGif: false,
    };

    AnalyticsService.trackVisitSignUpPage();
    AnalyticsService.gaTrackPageVisit();
  }

  handleInputChange = (event) => {
    const { target } = event;
    let value = target.type === 'checkbox' ? target.checked : target.value;

    if (target.name === 'phoneNumber') {
      // We only allow digits or empty string for phone number
      const isValidCharForPhone = /^[0-9+-/(/)]+$/.test(value);
      if (!isValidCharForPhone && value !== '') value = this.state.phoneNumber;
    }

    this.setState({ [target.name]: value });
  };

  validateEmailForm = () => {
    const { email, password, agreeToTerms } = this.state;

    if (!validateEmail(email.trim().toLowerCase())) {
      return 'Please enter a valid email';
    }
    const passwordCheck = checkPasswordStrength(password);
    if (!passwordCheck.strong) {
      return passwordCheck.errors[0];
    }

    if (!agreeToTerms) {
      return 'Please agree to our Terms of Service';
    }

    return null;
  };

  // TODO: Handle all inputs on blur, not just phone number
  validateAndCorrectPhoneNumber = () => {
    const { phoneNumber } = this.state;

    if (phoneNumber !== '') {
      const phoneCheck = phone(phoneNumber);
      if (phoneCheck.length === 0) {
        this.props.setUserError('Please enter a valid phone number');
        return;
      }

      this.props.setUserError(null);

      const correctedPhoneNumber = phoneCheck[0];
      if (correctedPhoneNumber) {
        this.setState({ phoneNumber: correctedPhoneNumber });
      }
    } else {
      this.props.setUserError(null);
    }
  };

  validateProfileForm = () => {
    const { firstName, lastName, phoneNumber, industryProduct } = this.state;

    if (!firstName) {
      return 'Please enter a first name';
    }
    if (!lastName) {
      return 'Please enter a last name';
    }
    if (phoneNumber) {
      const phoneCheck = phone(phoneNumber);
      if (phoneCheck.length === 0) {
        return 'Please enter a valid phone number';
      }
      const correctedPhoneNumber = phoneCheck[0];
      this.setState({
        phoneNumber: correctedPhoneNumber,
        showGif: true,
      });
    }
    if (!industryProduct) {
      return 'Please select the industry you work in';
    }

    return null;
  };

  handleSubmitEmailForm = (event) => {
    event.preventDefault();

    const { email, password, rememberMe } = this.state;
    const validationError = this.validateEmailForm();

    if (validationError) {
      this.props.setUserError(validationError);
      return;
    }

    this.props.signUp({
      email: email.trim().toLowerCase(),
      password,
      rememberMe,
    });
  };

  handleSubmitProfileForm = (event) => {
    event.preventDefault();

    const validationError = this.validateProfileForm();

    if (validationError) {
      this.props.setUserError(validationError);
      return;
    }

    AnalyticsService.trackCompleteRegistrationEvent();

    this.props.updateProfile({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber || null,
      industryProduct: this.state.industryProduct,
      accessCode: this.state.accessCode || null,
    });
  };

  handleSubmitEmailAndProfileMixedForm = (event) => {
    event.preventDefault();

    const {
      email,
      password,
      rememberMe,
      firstName,
      lastName,
      phoneNumber,
      industryProduct,
      accessCode,
    } = this.state;

    const validationError = this.validateEmailForm() || this.validateProfileForm();

    if (validationError) {
      this.props.setUserError(validationError);
      return;
    }

    AnalyticsService.trackCompleteRegistrationEvent();

    this.props.signUpAndUpdateProfile({
      email: email.trim().toLowerCase(),
      password,
      rememberMe,
      userProfile: {
        firstName,
        lastName,
        phoneNumber: phoneNumber || null,
        industryProduct,
        accessCode: accessCode || null,
      },
    });
  };

  handleResendVerificationEmailClick = () => {
    this.props.resendVerificationEmail();
    // this.setState({ resendVerificationEmailClicked: true });
  };

  renderEmailForm = () => {
    const { email, password, agreeToTerms, rememberMe } = this.state;
    const formError = this.props.user.error;

    return (
      <form className="full--width" onSubmit={this.handleSubmitEmailForm}>
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
              autoComplete="new-password"
            />
          </Box>
          <Box direction="column" gap="small" margin={{ horizontal: '80px', vertical: '15px' }}>
            <CheckBox
              className="zero-height"
              name="rememberMe"
              label="Remember me"
              checked={rememberMe}
              onChange={this.handleInputChange}
            />
            <CheckBox
              className="zero-height"
              name="agreeToTerms"
              /* prettier-ignore */
              label={(
                <Text size="small">
                  I agree to the T4&nbsp;
                  <Anchor
                    label="Terms of Service"
                    margin={{ horizontal: '10px' }}
                    href="https://t4.ai/terms_of_service.pdf"
                    target="_blank"
                  />
                  and
                  <Anchor label="Privacy Policy" margin={{ left: '10px' }} href="https://t4.ai/privacy_policy.pdf" target="_blank" />
                </Text>
              )}
              checked={agreeToTerms}
              onChange={this.handleInputChange}
            />
          </Box>
          <Box
            margin={{ top: 'xsmall' }}
            align="center"
            round="4px"
          >
            <Button label="Sign up" type="submit" variant="primary" />
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

  renderProfileForm = () => {
    const {
      firstName,
      lastName,
      phoneNumber,
      password,
      rememberMe,
      agreeToTerms,
      industryProduct,
      showingEmailAndProfileStageMixed,
    } = this.state;
    let formError = this.props.user.error;
    // TODO: FIX THIS
    if (formError === 'Your access code is not valid') {
      formError = (
        <span>
          Your access code is not valid. Please contact&nbsp;
          <Anchor href="mailto:sales@t4.ai" margin={{ left: '8px' }}>
            sales@t4.ai
          </Anchor>
        </span>
      );
    }

    return (
      <form
        className="full--width"
        onSubmit={
          showingEmailAndProfileStageMixed
            ? this.handleSubmitEmailAndProfileMixedForm
            : this.handleSubmitProfileForm
        }
      >
        <Box direction="column" gap="medium">
          <Box direction="column" align="center" gap="small">
            <TextInput
              name="firstName"
              placeholder="First name"
              type="text"
              value={firstName}
              onChange={this.handleInputChange}
              autoComplete="given-name"
            />
            <TextInput
              name="lastName"
              placeholder="Last name"
              type="text"
              value={lastName}
              onChange={this.handleInputChange}
              autoComplete="family-name"
            />
            <TextInput
              name="phoneNumber"
              placeholder="Phone number"
              type="text"
              value={phoneNumber}
              onChange={this.handleInputChange}
              onBlur={this.validateAndCorrectPhoneNumber}
              autoComplete="tel"
            />
            {showingEmailAndProfileStageMixed && (
              <TextInput
                name="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={this.handleInputChange}
                autoComplete="new-password"
              />
            )}
            <SignUpSelect
              options={['Cybersecurity', 'eSports', 'Other']}
              value={industryProduct}
              placeholder="Pick an industry"
              onChange={(option) => this.setState({ industryProduct: option })}
            />
            <Text size="small" alignSelf="start" margin="xsmall">
              * Contact&nbsp;
              <Anchor
                href="mailto:sales@t4.ai"
                label="sales@t4.ai"
                margin={{ horizontal: '10px' }}
              />
              &nbsp;to get an access code
            </Text>
          </Box>
          {showingEmailAndProfileStageMixed && (
            <Box direction="column" gap="small" margin={{ horizontal: '10px', vertical: '15px' }}>
              <CheckBox
                className="zero-height"
                name="rememberMe"
                label="Remember me"
                checked={rememberMe}
                onChange={this.handleInputChange}
              />
              <CheckBox
                className="zero-height"
                name="agreeToTerms"
                /* prettier-ignore */
                label={(
                  <Text size="small">
                    I agree to the T4&nbsp;
                    <Anchor
                      margin={{ horizontal: '10px' }}
                      label="Terms of Service"
                      href="https://t4.ai/terms_of_service.pdf"
                      target="_blank"
                    />
                    and
                    <Anchor label="Privacy Policy" margin={{ left: '10px' }} href="https://t4.ai/privacy_policy.pdf" target="_blank" />
                  </Text>
                )}
                checked={agreeToTerms}
                onChange={this.handleInputChange}
              />
            </Box>
          )}
          <Box
            margin={{ top: 'xsmall' }}
            round="4px"
            align="center"
          >
            <Button label="Done" type="submit" variant="primary" />
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

  renderVerifyEmailForm = () => {
    if (!this.state.showGif) {
      return <Redirect to="/explorer" />;
    }

    // const { resendVerificationEmailClicked } = this.state;
    window.setTimeout(() => this.props.history.push('/explorer'), 2250);
    return (
      <Box direction="column" gap="large" align="center" pad="medium">
        <Image src={t4Gif} width="250px" />
        {/* <Text size="large" alignSelf="start">
        Please confirm your account by following the instructions in our verification email
      </Text>
      {resendVerificationEmailClicked ? (
        <Text size="medium" alignSelf="start">
          You should receive an email shortly
        </Text>
      ) : (
        <Text size="medium" alignSelf="start">
          If you did not receive an email from us, please click&nbsp;
          <Anchor label="here" onClick={this.handleResendVerificationEmailClick} />
        </Text>
      )}
      <Text size="small" margin={{ top: 'medium' }} alignSelf="start">
        <Anchor label="Log Out" to="/login" as={Link} onClick={this.props.logout} />
      </Text> */}
      </Box>
    );
  };

  renderContent = (stage) => {
    switch (stage) {
      case EMAIL_STAGE:
        return this.renderEmailForm();
      case PROFILE_STAGE:
        return this.renderProfileForm();
      case VERIFY_EMAIL_STAGE:
        return this.renderVerifyEmailForm();
      default:
        return this.renderEmailForm();
    }
  };

  render() {
    const { authState } = this.props.auth;
    const { emailVerificationToken, showingEmailAndProfileStageMixed } = this.state;

    let stage = EMAIL_STAGE;
    if (isProfileComplete(authState)) stage = VERIFY_EMAIL_STAGE;
    else if (isUserLoggedIn(authState) || showingEmailAndProfileStageMixed) stage = PROFILE_STAGE;

    if (emailVerificationToken && !isUserLoggedIn(authState)) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            search: window.location.search,
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <LoaderOverlay show={this.props.api.loading && stage === EMAIL_STAGE} />
        {stage !== VERIFY_EMAIL_STAGE && (
          <Box
            direction="column"
            align="center"
            margin={{ bottom: 'medium' }}
            gap="medium"
            pad={{ horizontal: 'medium' }}
          >
            <Text textAlign="center" weight="bold" size="xxlarge" color="#222B45">
              Sign up
            </Text>
          </Box>
        )}
        {this.renderContent(stage)}
      </React.Fragment>
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
        signUp,
        signUpAndUpdateProfile,
        resendVerificationEmail,
        verifyEmail,
        logout,
        setUserError,
        updateProfile,
      },
      dispatch,
    ),
)(withRouter(SignUpContent));

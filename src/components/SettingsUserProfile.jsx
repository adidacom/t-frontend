import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Select from 'react-select';
import phone from 'phone';
import { updateProfile, setUserError } from '../redux';
import * as AnalyticsService from '../utils/analytics';
import COUNTRIES_REGIONS from '../utils/countries_regions_keyvals.json';
import { USER_PROFILE_INDUSTRIES, USER_PROFILE_PRACTICE_AREAS } from '../utils/constants';

// TODO: Move these styles to constants
const SELECT_STYLES = {
  dropdownIndicator: (base, state) => ({
    ...base,
    transition: 'all .2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
  }),
};

class SettingsUserProfile extends React.Component {
  constructor(props) {
    super(props);
    const { user } = props;
    const { country, state, industry, practiceArea } = user;

    const countryOptions = Object.keys(COUNTRIES_REGIONS).map((item) => ({
      value: item,
      label: item,
    }));
    const industryOptions = USER_PROFILE_INDUSTRIES.map((item) => ({
      value: item,
      label: item,
    }));
    const practiceAreaOptions = USER_PROFILE_PRACTICE_AREAS.map((item) => ({
      value: item,
      label: item,
    }));
    let stateOptions = [];

    const initCountry = Object.keys(COUNTRIES_REGIONS).includes(country)
      ? { value: country, label: country }
      : null;
    const initIndustry = USER_PROFILE_INDUSTRIES.includes(industry)
      ? { value: industry, label: industry }
      : null;
    const initPracticeArea = USER_PROFILE_PRACTICE_AREAS.includes(practiceArea)
      ? { value: practiceArea, label: practiceArea }
      : null;
    let initState = null;

    if (initCountry) {
      stateOptions = COUNTRIES_REGIONS[initCountry.value].map((item) => ({
        value: item,
        label: item,
      }));
      initState = COUNTRIES_REGIONS[initCountry.value].includes(state)
        ? { value: state, label: state }
        : null;
    }

    this.selectOptions = {
      country: countryOptions,
      state: stateOptions,
      industry: industryOptions,
      practiceArea: practiceAreaOptions,
    };

    this.state = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
      city: user.city || '',
      stateSelection: initState,
      countrySelection: initCountry,
      companyName: user.companyName || '',
      industrySelection: initIndustry,
      practiceAreaSelection: initPracticeArea,
      showSubmitButton: false,
      submitButtonPressed: false,
    };

    AnalyticsService.trackVisitSettingsUserProfilePage();
    AnalyticsService.gaTrackPageVisit();
  }

  componentDidMount() {
    this.props.setUserError(null);
  }

  handleInputChange = (event) => {
    const { target } = event;
    let { value } = target;

    if (target.name === 'phoneNumber') {
      // We only allow digits or empty string
      const isValidCharForPhone = /^[0-9+-/(/)]+$/.test(value);
      if (!isValidCharForPhone && value !== '') value = this.state.phoneNumber;
    }

    this.setState({
      [target.name]: value,
      showSubmitButton: true,
    });
  };

  handleSelectChange = (selection, source) => {
    if (source.action === 'select-option') {
      const newState = {
        [source.name]: selection,
        showSubmitButton: true,
      };

      if (
        source.name === 'countrySelection' &&
        (this.state.countrySelection ? selection.value !== this.state.countrySelection.value : true)
      ) {
        newState.stateSelection = null;
        this.selectOptions.state = COUNTRIES_REGIONS[selection.value].map((item) => ({
          value: item,
          label: item,
        }));
      }

      this.setState(newState);
    }
  };

  validateProfileInputs = () => {
    const { firstName, lastName, phoneNumber } = this.state;

    if (!firstName.length) {
      return 'Please enter a first name';
    }
    if (!lastName.length) {
      return 'Please enter a last name';
    }
    if (phoneNumber !== '') {
      const phoneCheck = phone(phoneNumber);
      if (phoneCheck.length === 0) {
        return 'Please enter a valid phone number';
      }
      const correctedPhoneNumber = phoneCheck[0];
      this.setState({ phoneNumber: correctedPhoneNumber });
    }

    return null;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // Remove focus outline after click
    event.target.submit.blur();

    const validationError = this.validateProfileInputs();

    if (validationError) {
      this.props.setUserError(validationError);
      return;
    }

    // Need to format phone number correctly
    const phoneCheck = phone(this.state.phoneNumber);
    const correctedPhoneNumber = phoneCheck[0];

    this.props.updateProfile({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: correctedPhoneNumber,
      city: this.state.city,
      state: this.state.stateSelection ? this.state.stateSelection.value : null,
      country: this.state.countrySelection ? this.state.countrySelection.value : null,
      companyName: this.state.companyName,
      industry: this.state.industrySelection ? this.state.industrySelection.value : null,
      practiceArea: this.state.practiceAreaSelection
        ? this.state.practiceAreaSelection.value
        : null,
    });

    this.setState({
      submitButtonPressed: true,
    });
  };

  render() {
    const { showSubmitButton, submitButtonPressed } = this.state;
    const userError = this.props.user.error;

    return (
      <div>
        <form className="Settings__Content-Area__form" onSubmit={this.handleSubmit}>
          <div className="Settings__Content-Area__section">
            <div className="Settings__Content-Area__section-header">Name</div>
            <div className="Settings__Content-Area__section__input-container">
              <input
                type="text"
                name="firstName"
                placeholder="first name"
                autoComplete="given-name"
                value={this.state.firstName}
                onChange={this.handleInputChange}
              />
              <div className="spacer--v--10" />
              <input
                type="text"
                name="lastName"
                placeholder="last name"
                autoComplete="family-name"
                value={this.state.lastName}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="spacer--v--30" />
          <div className="Settings__Content-Area__section">
            <div className="Settings__Content-Area__section-header">Contact</div>
            <div className="Settings__Content-Area__section__input-container">
              <input
                type="text"
                name="phoneNumber"
                placeholder="phone number"
                autoComplete="tel"
                value={this.state.phoneNumber}
                onChange={this.handleInputChange}
              />
              <div className="spacer--v--10" />
              <input
                type="text"
                name="city"
                placeholder="city"
                autoComplete="address-level2"
                value={this.state.city}
                onChange={this.handleInputChange}
              />
              <div className="spacer--v--10" />
              <Select
                name="countrySelection"
                options={this.selectOptions.country}
                classNamePrefix="Settings__Content-Area__Select"
                placeholder="country"
                autoComplete="off"
                onChange={this.handleSelectChange}
                value={this.state.countrySelection}
                styles={SELECT_STYLES}
              />
              <div className="spacer--v--10" />
              <Select
                name="stateSelection"
                options={this.selectOptions.state}
                classNamePrefix="Settings__Content-Area__Select"
                placeholder="state"
                autoComplete="off"
                onChange={this.handleSelectChange}
                value={this.state.stateSelection}
                isDisabled={!this.state.countrySelection}
                styles={SELECT_STYLES}
              />
            </div>
          </div>
          <div className="spacer--v--30" />
          <div className="Settings__Content-Area__section">
            <div className="Settings__Content-Area__section-header">Company Name</div>
            <div className="Settings__Content-Area__section__input-container">
              <input
                type="text"
                name="companyName"
                placeholder="company name"
                autoComplete="organization"
                value={this.state.companyName}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="spacer--v--10" />
          <div className="Settings__Content-Area__section">
            <div className="Settings__Content-Area__section-header">Industry</div>
            <div className="Settings__Content-Area__section__input-container">
              <Select
                name="industrySelection"
                options={this.selectOptions.industry}
                classNamePrefix="Settings__Content-Area__Select"
                placeholder="industry*"
                autoComplete="off"
                onChange={this.handleSelectChange}
                value={this.state.industrySelection}
                styles={SELECT_STYLES}
              />
            </div>
          </div>
          <div className="spacer--v--10" />
          <div className="Settings__Content-Area__section">
            <div className="Settings__Content-Area__section-header">Area of Practice</div>
            <div className="Settings__Content-Area__section__input-container">
              <Select
                name="practiceAreaSelection"
                options={this.selectOptions.practiceArea}
                classNamePrefix="Settings__Content-Area__Select"
                placeholder="practice area*"
                autoComplete="off"
                onChange={this.handleSelectChange}
                value={this.state.practiceAreaSelection}
                styles={SELECT_STYLES}
              />
            </div>
          </div>
          <div className="spacer--v--20" />
          <div className="Settings__Content-Area__section">
            <div className="Settings__Content-Area__section-header" />
            <div className="Settings__Content-Area__section__input-container">
              {showSubmitButton && <input type="submit" name="submit" value="Save Profile" />}
              {submitButtonPressed && !userError && (
                <span className="Settings__Content-Area__message-text">
                  Your profile has been updated.
                </span>
              )}
              {userError && (
                <span className="Settings__Content-Area__message-text color--red">{userError}</span>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    user: state.user,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        updateProfile,
        setUserError,
      },
      dispatch,
    ),
)(SettingsUserProfile);

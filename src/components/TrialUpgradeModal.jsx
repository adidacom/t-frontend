import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import './css/TrialUpgradeModal.css';

class TrialUpgradeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMeetingsWidget: false,
    };
  }

  onEnter = () => {
    this.setState({
      showMeetingsWidget: false,
    });
    const hsScript = document.createElement('script');
    hsScript.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
    document.body.appendChild(hsScript);
  };

  handleScheduleButtonClick = () => {
    this.setState({
      showMeetingsWidget: true,
    });
  };

  render() {
    const { showMeetingsWidget } = this.state;
    const { show, user, title = "Let's upgrade your account!" } = this.props;
    const { firstName, lastName, email } = user;

    return (
      <CSSTransition
        in={show}
        timeout={300}
        classNames="fade-animation-300"
        unmountOnExit
        onEnter={this.onEnter}
      >
        <div className="TrialUpgradeModal">
          <div className="TrialUpgradeModal__backdrop" onClick={this.props.handleOutsideClick} />
          <div className="TrialUpgradeModal__body">
            <h1>{title}</h1>
            {!showMeetingsWidget && (
              <div>
                <span>How would you like to reach us?</span>
                <div className="TrialUpgradeModal__button-row">
                  <a href="mailto:sales@t4.ai?subject=Upgrade T4">
                    <div className="TrialUpgradeModal__button TrialUpgradeModal__button-light-opacity">
                      <FontAwesomeIcon
                        className="TrialUpgradeModal__button__icon"
                        icon={faEnvelope}
                      />
                      <span>Email</span>
                    </div>
                  </a>
                  <div
                    className="TrialUpgradeModal__button"
                    onClick={this.handleScheduleButtonClick}
                  >
                    <FontAwesomeIcon
                      className="TrialUpgradeModal__button__icon"
                      icon={faCalendarCheck}
                    />
                    <span>Meeting</span>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`meetings-iframe-container${
                showMeetingsWidget ? '' : ' meetings-iframe-container-hidden'
              }`}
              data-src={`${process.env.REACT_APP_HUBSPOT_MEETINGS_URL}?embed=true&firstName=${firstName}&lastName=${lastName}&email=${email}`}
            />
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default connect((state) => ({
  user: state.user,
}))(TrialUpgradeModal);

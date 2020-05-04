import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { isUserAuthorized } from '../utils/auth';
import IconMenu from './IconMenu';
import { USER_SUBSCRIPTION_STATUSES } from '../utils/constants';
import { trackCTAHeaderClick } from '../utils/analytics';
import logo from '../assets/logo_header.png';
import TrialUpgradeModal from './TrialUpgradeModal';
import './css/Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTrialUpgradeModal: false,
    };
  }

  handleCTAButtonClick = () => {
    trackCTAHeaderClick();
    this.setState({ showTrialUpgradeModal: true });
  };

  render() {
    const selectedPage = window.location.pathname.split('/').pop();
    const userLoggedIn = isUserAuthorized(this.props.auth.authState);
    const { user } = this.props;
    const isTrialSubscription =
      userLoggedIn && user.subscription.status === USER_SUBSCRIPTION_STATUSES.TRIAL;
    const { showTrialUpgradeModal } = this.state;

    // TODO: Temporary fix for company page
    let isVideoGamesAcct = false;
    if (user && user.industriesEnabled) {
      isVideoGamesAcct = isEqual(user.industriesEnabled[0].slice(0, 2), [
        'Technology',
        'Video Gaming',
      ]);
    }

    return [
      <header key="0" className="Header">
        <div className="Header__col1">
          <Link to="/explorer">
            <img src={logo} className="Header__logo" alt="T4" />
          </Link>
        </div>
        <div className="Header__col2">
          {userLoggedIn && (
            <div className="Header__nav">
              <div className={selectedPage === 'explorer' ? 'Header__nav-current' : ''}>
                <Link to="/explorer">Industries</Link>
              </div>
              {!isVideoGamesAcct && (
                <React.Fragment>
                  <div className="spacer--h--20" />
                  <div className={selectedPage === 'company' ? 'Header__nav-current' : ''}>
                    <Link to="/company">Companies</Link>
                  </div>
                </React.Fragment>
              )}
              <div className="spacer--h--20" />
              <div className={selectedPage === 'search' ? 'Header__nav-current' : ''}>
                <Link to="/search">Reports</Link>
              </div>
              <div className="spacer--h--20" />
              <div className={selectedPage === 'help' ? 'Header__nav-current' : ''}>
                <Link to="/help">Help</Link>
              </div>
              {user.role === 'ADMIN' && (
                <React.Fragment>
                  <div className="spacer--h--20" />
                  <div className={selectedPage === 'admin' ? 'Header__nav-current' : ''}>
                    <Link to="/admin">ADMIN</Link>
                  </div>
                </React.Fragment>
              )}
            </div>
          )}
        </div>
        <div className="Header__col3">
          {isTrialSubscription && (
            <React.Fragment>
              <div className="Header__cta-text">
                Searches Remaining:&nbsp;
                {user.subscription.searchesRemaining}
              </div>
              <div className="Header__cta-button" onClick={this.handleCTAButtonClick}>
                Upgrade
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="Header__col4">
          <IconMenu />
        </div>
      </header>,
      <div key="1" className="Header__holder" />,
      <TrialUpgradeModal
        key="2"
        show={showTrialUpgradeModal}
        handleOutsideClick={() => this.setState({ showTrialUpgradeModal: false })}
      />,
    ];
  }
}

export default connect((state) => ({
  auth: state.auth,
  user: state.user,
}))(Header);

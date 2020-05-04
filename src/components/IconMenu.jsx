import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { isUserAuthorized } from '../utils/auth';
import { logout } from '../redux';
import './css/IconMenu.css';

class IconMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  toggleMenu = () => {
    const { showMenu } = this.state;
    this.setState({
      showMenu: !showMenu,
    });
  };

  // Handles inside and outside document clicks
  handleDocumentClick = (event) => {
    if (this.node) {
      if (this.node.contains(event.target)) {
        // Inside click
        return;
      }

      this.setState({
        showMenu: false,
      });
    }
  };

  logout = () => {
    this.props.logout();
  };

  render() {
    const userLoggedIn = isUserAuthorized(this.props.auth.authState);

    return (
      <div
        className="IconMenu"
        onClick={this.toggleMenu}
        ref={(node) => {
          this.node = node;
        }}
      >
        <FontAwesomeIcon icon={faUser} />
        {this.state.showMenu && (
          <div className="IconMenu__list">
            {userLoggedIn ? (
              <ul>
                <Link to="/settings">
                  <li key="0">Settings</li>
                </Link>
                <li key="1" onClick={this.logout}>
                  Log Out
                </li>
              </ul>
            ) : (
              <ul>
                <Link to="/login">
                  <li key="0">Log In</li>
                </Link>
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    auth: state.auth,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        logout,
      },
      dispatch,
    ),
)(IconMenu);

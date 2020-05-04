import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { INITIALIZED } from '../utils/auth';
import PrivateRoute from '../components/PrivateRoute';
import Login from './Login';
import Initialize from './Initialize';
import Search from './Search';
import Settings from './Settings';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import UnsupportedBrowser from './UnsupportedBrowser';
import AdminPanel from './AdminPanel';
import { isModernChrome, isMobileDevice } from '../utils/tools';

const history = createBrowserHistory();

function Routes(props) {
  const { auth } = props;
  const { authState } = auth;

  if (authState <= INITIALIZED) {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" component={Initialize} />
        </Switch>
      </Router>
    );
  }

  const isSupportedBrowser = isModernChrome() && !isMobileDevice();

  return (
    <Router history={history}>
      {isSupportedBrowser ? (
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/register" component={SignUp} />
          <Route exact path="/resetpassword" component={ResetPassword} />
          <PrivateRoute exact path="/search" authState={authState} component={Search} />
          <PrivateRoute exact path="/settings" authState={authState} component={Settings} />
          <PrivateRoute path="/settings/:page" authState={authState} component={Settings} />
          <PrivateRoute exact path="/admin" authState={authState} component={AdminPanel} />
          <Route path="/" render={() => <Redirect to="/login" />} />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/register" component={SignUp} />
          <Route exact path="/" render={() => <Redirect to="/signup" />} />
          <Route path="/" component={UnsupportedBrowser} />
        </Switch>
      )}
    </Router>
  );
}

export default connect(
  (state) => ({
    auth: state.auth,
  }),
  {},
)(Routes);

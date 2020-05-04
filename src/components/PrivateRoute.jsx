import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isUserLoggedIn, isUserAuthorized } from '../utils/auth';

export default ({ component: Component, ...rest }) => {
  const isLoggedIn = isUserLoggedIn(rest.authState);
  const isAuthorized = isUserAuthorized(rest.authState);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthorized) return <Component {...props} />;
        if (isLoggedIn) {
          return (
            <Redirect
              to={{
                pathname: '/signup',
                state: { from: props.location },
                search: window.location.search,
              }}
            />
          );
        }
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
              search: window.location.search,
            }}
          />
        );
      }}
    />
  );
};

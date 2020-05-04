import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { ThemeProvider } from 'styled-components';
import { Helmet } from 'react-helmet-async';

import rootReducer, { t4Middleware } from '../redux';
import Routes from './Routes';
import UnsupportedBrowser from './UnsupportedBrowser';
import ErrorBoundary from '../components/ErrorBoundary';
import { isChrome, isFirefox, isIEorEdge } from '../utils/tools';
import { trackError } from '../utils/analytics';
import { defaultTheme } from '../settings';
import './css/common.css';
import './css/App.css';

const middlewares = [thunkMiddleware, t4Middleware];
const store = createStore(rootReducer, applyMiddleware(...middlewares));

function App() {
  window.onerror = (msg, url, lineNo, columnNo, info) => {
    trackError({
      error: 'Frontend error.',
      info,
      location: window.location.pathname,
    });
  };

  if (isIEorEdge()) {
    return (
      <React.Fragment>
        <Helmet>
          <title>T4 | Find Market Research In Seconds</title>
          <link rel="canonical" href="https://app.t4.ai" />
        </Helmet>
        <UnsupportedBrowser />
      </React.Fragment>
    );
  }

  // Inject Wordspacing CSS
  if (isChrome() || isFirefox()) {
    document.body.style['word-spacing'] = '-0.25em';
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>T4 | Find Market Research In Seconds</title>
        <link rel="canonical" href="https://app.t4.ai" />
      </Helmet>
      <ErrorBoundary>
        <ThemeProvider theme={defaultTheme}>
          <Provider store={store}>
            <Routes />
          </Provider>
        </ThemeProvider>
      </ErrorBoundary>
    </React.Fragment>
  );
}

export default App;

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { HelmetProvider } from 'react-helmet-async';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';

Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });

function modifyEventOptions(type, options) {
  const EVENTS_TO_MODIFY = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel'];
  let modOptions = options;
  if (EVENTS_TO_MODIFY.indexOf(type) > -1) {
    if (typeof options === 'boolean') {
      modOptions = {
        capture: options,
        passive: false,
      };
    } else if (typeof options === 'object') {
      modOptions = {
        passive: false,
        ...options,
      };
    }
  }
  return modOptions;
}

const originalAddEventListener = document.addEventListener.bind();
document.addEventListener = (type, listener, options, wantsUntrusted) => {
  const modOptions = modifyEventOptions(type, options);
  return originalAddEventListener(type, listener, modOptions, wantsUntrusted);
};

const originalRemoveEventListener = document.removeEventListener.bind();
document.removeEventListener = (type, listener, options) => {
  const modOptions = modifyEventOptions(type, options);
  return originalRemoveEventListener(type, listener, modOptions);
};

ReactDOM.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
  document.getElementById('root'),
);
serviceWorker.unregister();

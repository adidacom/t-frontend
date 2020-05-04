import React from 'react';
import { configure } from '@storybook/react';
import '../src/pages/css/common.css';
import '../src/pages/css/App.css';

const req = require.context('../src', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);

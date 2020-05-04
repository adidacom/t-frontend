import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../settings';

import Badge from './badge';

storiesOf('Badge', module).add('default', () => (
  <ThemeProvider theme={defaultTheme}>
    <div style={{ width: '800px', padding: '20px' }}>
      <Badge type="firewall" />
      <Badge type="metric" />
      <Badge type="segment" />
    </div>
  </ThemeProvider>
));

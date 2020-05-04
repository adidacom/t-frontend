import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../settings';

import Card from './card';
import { data } from './data';

storiesOf('Card', module).add('default', () => (
  <ThemeProvider theme={defaultTheme}>
    <div style={{ width: '800px', padding: '20px' }}>
      <Card
        name="Credit Suisse"
        datetime="sep 2017"
        type="free"
        title="Cisco Systems"
        description="Report is an equity research report of Cisco from Credit Suisse that contains IT infrastructure revenue and forecasts"
        data={data}
        hasMore
      />
      <Card
        name="Credit Suisse"
        datetime="sep 2017"
        type="free"
        title="Cisco Systems"
        description="Report is an equity research report of Cisco from Credit Suisse that contains IT infrastructure revenue and forecasts"
        data={data}
      />
    </div>
  </ThemeProvider>
));

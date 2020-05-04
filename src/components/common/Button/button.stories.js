import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from './button';

storiesOf('Button', module)
  .add('Basic', () => (
    <>
      <Button label="Primary" variant="primary" onClick={action('clicked')} />
      <Button label="Outline" variant="primary" outline onClick={action('clicked')} />
      <Button label="Disabled" variant="primary" disabled onClick={action('clicked')} />
    </>
  ));

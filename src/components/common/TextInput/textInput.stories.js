import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TextInput from './textInput';

storiesOf('TextInput', module)
  .add('Text', () => (
    <TextInput
      type="text"
      placeholder="Email"
      onChange={action('changed')}
    />
  ))
  .add('Password', () => (
    <TextInput
      type="password"
      placeholder="Password"
      onChange={action('changed')}
    />
  ));

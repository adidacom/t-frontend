import React from 'react';
import { Helmet } from 'react-helmet-async';
import EntryContainer from '../components/EntryContainer';
import LoginContent from '../components/LoginContent';

export default function SignUp() {
  return (
    <EntryContainer screen="signin">
      <Helmet>
        <title>T4 | Log In</title>
        <link rel="canonical" href="https://app.t4.ai/login" />
      </Helmet>
      <LoginContent />
    </EntryContainer>
  );
}

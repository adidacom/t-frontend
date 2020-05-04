import React from 'react';
import { Helmet } from 'react-helmet-async';
import EntryContainer from '../components/EntryContainer';
import SignUpContent from '../components/SignUpContent';

export default function SignUp() {
  return (
    <EntryContainer screen="signup">
      <Helmet>
        <title>T4 | Find Market Research In Seconds</title>
        <link rel="canonical" href="https://app.t4.ai/signup" />
      </Helmet>
      <SignUpContent />
    </EntryContainer>
  );
}

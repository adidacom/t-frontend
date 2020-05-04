import { createAction } from 'redux-actions';

import {
  USER_SIGN_UP,
  USER_SIGN_UP_AND_UPDATE_PROFILE,
  USER_RESEND_VERIFICATION_EMAIL,
  USER_VERIFY_EMAIL,
  USER_PROFILE,
  USER_SET_PROFILE,
  USER_SET_ERROR,
  CHANGE_PASSWORD,
  START_RESET_PASSWORD,
  CHECK_RESET_PASSWORD_TOKEN,
  RESET_PASSWORD,
  SET_RESET_PASSWORD_TOKEN_VALID,
} from '../types';

export const signUp = createAction(USER_SIGN_UP, (payload) => payload);
export const signUpAndUpdateProfile = createAction(
  USER_SIGN_UP_AND_UPDATE_PROFILE,
  (payload) => payload,
);
export const resendVerificationEmail = createAction(
  USER_RESEND_VERIFICATION_EMAIL,
  (payload) => payload,
);
export const verifyEmail = createAction(USER_VERIFY_EMAIL, (payload) => payload);
export const profile = createAction(USER_PROFILE, (payload) => payload);
export const updateProfile = createAction(USER_SET_PROFILE, (payload) => payload);
export const setUserError = createAction(USER_SET_ERROR, (payload) => payload);
export const changePassword = createAction(CHANGE_PASSWORD, (payload) => payload);
export const startResetPassword = createAction(START_RESET_PASSWORD, (payload) => payload);
export const checkResetPasswordToken = createAction(
  CHECK_RESET_PASSWORD_TOKEN,
  (payload) => payload,
);
export const resetPassword = createAction(RESET_PASSWORD, (payload) => payload);
export const setResetPasswordTokenValid = createAction(
  SET_RESET_PASSWORD_TOKEN_VALID,
  (payload) => payload,
);

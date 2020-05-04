export const INITIALIZED = 0;
export const LOGGED_OUT = 10;
export const LOGGED_IN = 20;
export const PROFILE_COMPLETE = 30;
export const AUTHORIZED = 50;

export function isUserLoggedIn(authState) {
  return authState >= LOGGED_IN;
}

export function isProfileComplete(authState) {
  return authState >= PROFILE_COMPLETE;
}

export function isUserAuthorized(authState) {
  return authState >= AUTHORIZED;
}

export function getAuthState(userProfile) {
  // NOTE: Removed Email Verification Requirement
  if (userProfile.profileComplete && userProfile.emailVerified) return AUTHORIZED;
  if (userProfile.profileComplete) return AUTHORIZED;
  return LOGGED_IN;
}

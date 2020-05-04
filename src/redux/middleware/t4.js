import {
  // Auth
  INIT_APP,
  LOGIN,
  LOGOUT,
  // SET_TOKEN,

  // User
  USER_SIGN_UP,
  USER_SIGN_UP_AND_UPDATE_PROFILE,
  USER_RESEND_VERIFICATION_EMAIL,
  USER_VERIFY_EMAIL,
  USER_SET_PROFILE,
  START_RESET_PASSWORD,
  CHECK_RESET_PASSWORD_TOKEN,
  RESET_PASSWORD,
  CHANGE_PASSWORD,

  // Search
  SEARCH_INITIAL_LOAD,
  // SEARCH_DROPDOWN,
  // SEARCH_FIELDS,
  GET_SEARCH_RESULTS,
  SEARCH_GET_NEXT_PAGE,
  // SET_SEARCH_RESULTS

  // Explorer
  EXPLORER_GET_DISTINCT_INDUSTRIES,
  EXPLORER_GET_DISTINCT_INDUSTRIES_PREVIEW,
  EXPLORER_SET_LISTS_INDUSTRY,
} from '../types';

import * as api from '../actions/api';
import * as auth from '../actions/auth';
import * as explorer from '../actions/explorer';
import * as search from '../actions/search';
import * as user from '../actions/user';

import {
  whoami,
  signUp,
  resendVerificationEmail,
  verifyEmail,
  checkAccessCode,
  activateAccessCode,
  login,
  generateResetPasswordToken,
  checkResetPasswordToken,
  resetPassword,
  updateProfile,
  getSearchResults,
  UNAUTHORIZED,
  changePassword,
  getDistinctIndustries,
  getDistinctIndustriesPreview,
  getIndustryOverview,
} from '../../utils/api';
import { getAuthState, LOGGED_OUT, LOGGED_IN } from '../../utils/auth';
import { getToken, removeToken, storeToken, validJwt } from '../../utils/token';
import { pathArrayToTree } from '../../utils/tools';
import * as AnalyticsService from '../../utils/analytics';

const handlers = {
  [INIT_APP]: async (store) => {
    const token = getToken();
    if (token && validJwt(token)) {
      try {
        store.dispatch(api.setLoadingState(true));
        const userProfile = await whoami();
        const authState = getAuthState(userProfile);
        store.dispatch(user.profile(userProfile));
        store.dispatch(auth.setAuthState(authState));
        store.dispatch(auth.setToken(token));
        store.dispatch(api.setLoadingState(false));

        AnalyticsService.identifyUser(userProfile.id);
        AnalyticsService.trackVisit();
      } catch (error) {
        removeToken();
        store.dispatch(auth.setAuthState(LOGGED_OUT));
        store.dispatch(user.profile(null));
        store.dispatch(user.setUserError(null));
        store.dispatch(api.setLoadingState(false));
      }
    } else {
      removeToken();
      store.dispatch(auth.setAuthState(LOGGED_OUT));
      store.dispatch(user.profile(null));
      store.dispatch(user.setUserError(null));
      store.dispatch(api.setLoadingState(false));
    }
  },
  [USER_SIGN_UP]: async (store, payload) => {
    try {
      store.dispatch(api.setLoadingState(true));
      const { token, newSignup } = await signUp(payload.email, payload.password);
      storeToken(token, payload.rememberMe);
      const userProfile = await whoami();
      store.dispatch(user.profile(userProfile));
      store.dispatch(auth.setAuthState(LOGGED_IN));
      store.dispatch(auth.setToken(token));
      store.dispatch(user.setUserError(null));
      store.dispatch(api.setLoadingState(false));

      if (newSignup) {
        await AnalyticsService.trackSignup(userProfile);
      }
    } catch ([status, message]) {
      removeToken();
      store.dispatch(auth.setAuthState(LOGGED_OUT));
      store.dispatch(api.setLoadingState(false));
      store.dispatch(user.profile(null));
      store.dispatch(user.setUserError(message));
    }
  },
  [USER_SIGN_UP_AND_UPDATE_PROFILE]: async (store, payload) => {
    try {
      store.dispatch(api.setLoadingState(true));
      const { email, password, userProfile } = payload;
      const { accessCode } = userProfile;

      let { authState } = store.getState().auth;

      // 1. Check access code
      // TODO: Move Access Code logic elsewhere (separate screen)
      if (accessCode) {
        await checkAccessCode(accessCode);
      }

      // 2. Sign up and store stoken
      if (authState < LOGGED_IN) {
        const { token, newSignup } = await signUp(email, password);
        storeToken(token, payload.rememberMe);
        store.dispatch(auth.setAuthState(LOGGED_IN));
        store.dispatch(auth.setToken(token));

        if (newSignup) {
          await AnalyticsService.trackSignup({ email, ...userProfile });
        }
      }

      // 3. Update profile and activate access code
      await updateProfile(userProfile);
      if (accessCode) {
        await activateAccessCode(accessCode);
      }

      // 4. Update local state
      const userProfileFromServer = await whoami();
      authState = getAuthState(userProfileFromServer);
      store.dispatch(user.profile(userProfileFromServer));
      store.dispatch(auth.setAuthState(authState));

      AnalyticsService.updateUser(userProfileFromServer);

      store.dispatch(user.setUserError(null));
      store.dispatch(api.setLoadingState(false));
    } catch ([status, message, endpoint]) {
      removeToken();
      store.dispatch(auth.setAuthState(LOGGED_OUT));
      store.dispatch(api.setLoadingState(false));
      store.dispatch(user.profile(null));

      if (endpoint === 'checkAccessCode') {
        store.dispatch(user.setUserError('Your access code is not valid'));
      } else {
        store.dispatch(user.setUserError('Please contact support@t4.ai'));
      }
    }
  },
  [USER_RESEND_VERIFICATION_EMAIL]: async (store) => {
    try {
      store.dispatch(api.setLoadingState(true));
      await resendVerificationEmail();
      store.dispatch(user.setUserError(null));
      store.dispatch(api.setLoadingState(false));
    } catch (error) {
      store.dispatch(user.setUserError('We were unable to send a verification email'));
    }
  },
  [USER_VERIFY_EMAIL]: async (store, payload) => {
    try {
      store.dispatch(api.setLoadingState(true));
      await verifyEmail(payload);
      const userProfile = await whoami();
      store.dispatch(user.profile(userProfile));
      const authState = getAuthState(userProfile);
      store.dispatch(auth.setAuthState(authState));
      store.dispatch(user.setUserError(null));
      store.dispatch(api.setLoadingState(false));
    } catch (error) {
      store.dispatch(user.setUserError('Your email verification link is invalid'));
    }
  },
  [LOGIN]: async (store, payload) => {
    try {
      // TODO: Fix this resetting
      store.dispatch(explorer.setExplorerIndustryTree({}));
      store.dispatch(explorer.setExplorerIndustrySearchItems([]));
      store.dispatch(explorer.setExplorerListsIndustry([]));
      store.dispatch(explorer.setExplorerPublishers([]));
      store.dispatch(explorer.setExplorerSetMetrics([]));
      store.dispatch(explorer.setExplorerSetSegmentations([]));

      store.dispatch(api.setLoadingState(true));
      const token = await login(payload.email, payload.password);
      storeToken(token, payload.rememberMe);
      const userProfile = await whoami();
      store.dispatch(user.profile(userProfile));
      const authState = getAuthState(userProfile);
      store.dispatch(auth.setAuthState(authState));
      store.dispatch(auth.setToken(token));
      store.dispatch(user.setUserError(null));
      store.dispatch(api.setLoadingState(false));
      AnalyticsService.trackLogin(userProfile.id);
    } catch ([status, message]) {
      removeToken();
      store.dispatch(auth.setAuthState(LOGGED_OUT));
      store.dispatch(api.setLoadingState(false));
      store.dispatch(user.profile(null));
      store.dispatch(user.setUserError(null));
      if (status === UNAUTHORIZED) {
        let displayMessage;
        if (message === 'Invalid login credentials.') {
          displayMessage = 'Please check your password';
        } else if (message === 'Email not found.') {
          displayMessage = 'This email was not found in our system';
        } else if (message === 'Password has not yet been created.') {
          displayMessage = 'Please complete your account';
        } else {
          displayMessage = 'Something went wrong';
        }
        store.dispatch(auth.loginError(displayMessage));
      }
    }
  },
  [LOGOUT]: (store) => {
    removeToken();
    store.dispatch(auth.setAuthState(LOGGED_OUT));
    store.dispatch(user.profile(null));
    store.dispatch(user.setUserError(null));

    // TODO: Fix this resetting
    store.dispatch(explorer.setExplorerIndustryTree({}));
    store.dispatch(explorer.setExplorerIndustrySearchItems([]));
    store.dispatch(explorer.setExplorerListsIndustry([]));
    store.dispatch(explorer.setExplorerPublishers([]));
    store.dispatch(explorer.setExplorerSetMetrics([]));
    store.dispatch(explorer.setExplorerSetSegmentations([]));

    AnalyticsService.trackLogout();
  },
  [CHANGE_PASSWORD]: async (store, payload) => {
    try {
      const { oldPassword, newPassword } = payload;
      store.dispatch(api.setLoadingState(true));
      await changePassword(oldPassword, newPassword);
      store.dispatch(user.setUserError(null));
      store.dispatch(api.setLoadingState(false));
    } catch (error) {
      store.dispatch(user.setUserError('Your old password is incorrect'));
      store.dispatch(api.setLoadingState(false));
    }
  },
  [START_RESET_PASSWORD]: async (store, payload) => {
    try {
      const email = payload;
      store.dispatch(api.setLoadingState(true));
      await generateResetPasswordToken(email);
      store.dispatch(user.setUserError(null));
      store.dispatch(api.setLoadingState(false));
    } catch ([status, message]) {
      let displayMessage;
      if (message === 'Please complete your account') {
        displayMessage = 'Please complete your account';
      } else {
        displayMessage = 'An account with this email does not exist';
      }
      store.dispatch(user.setResetPasswordTokenValid(false));
      store.dispatch(user.setUserError(displayMessage));
      store.dispatch(api.setLoadingState(false));
    }
  },
  [CHECK_RESET_PASSWORD_TOKEN]: async (store, payload) => {
    try {
      const token = payload;
      store.dispatch(api.setLoadingState(true));
      await checkResetPasswordToken(token);
      store.dispatch(user.setResetPasswordTokenValid(true));
      store.dispatch(user.setUserError(null));
      store.dispatch(api.setLoadingState(false));
    } catch (error) {
      store.dispatch(api.setLoadingState(false));
      store.dispatch(user.setResetPasswordTokenValid(false));
      store.dispatch(user.setUserError('Reset Password Link is invalid'));
    }
  },
  [RESET_PASSWORD]: async (store, payload) => {
    try {
      store.dispatch(api.setLoadingState(true));
      const { email, password, token } = payload;
      await resetPassword(email, password, token);
      store.dispatch(user.setUserError(null));
      store.dispatch(api.setLoadingState(false));
    } catch (error) {
      store.dispatch(api.setLoadingState(false));
      store.dispatch(user.setUserError('We were not able to reset your password'));
    }
  },
  [USER_SET_PROFILE]: async (store, payload) => {
    try {
      store.dispatch(api.setLoadingState(true));
      const userProfile = payload;

      // TODO: Move Access Code logic elsewhere (separate screen)
      const { accessCode } = payload;
      if (accessCode) {
        await checkAccessCode(accessCode);
      }

      await updateProfile(userProfile);
      store.dispatch(user.setUserError(null));
      if (accessCode) {
        await activateAccessCode(accessCode);
      }
      const userProfileFromServer = await whoami();
      const authState = getAuthState(userProfileFromServer);
      store.dispatch(user.profile(userProfileFromServer));
      store.dispatch(auth.setAuthState(authState));
      store.dispatch(api.setLoadingState(false));

      AnalyticsService.updateUser(userProfileFromServer);
    } catch (error) {
      store.dispatch(api.setLoadingState(false));
      if (error[2] === 'checkAccessCode') {
        store.dispatch(user.setUserError('Your access code is not valid'));
      } else {
        store.dispatch(user.setUserError('We were not able to update your profile'));
      }
    }
  },
  [SEARCH_INITIAL_LOAD]: async (store) => {
    store.dispatch(api.setLoadingState(true));
    const industries = await getDistinctIndustries();

    const industrySearchItems = [];
    for (let i = 0; i < industries.length; i++) {
      const industry = industries[i];
      for (let j = 1; j < industry.length + 1; j++) {
        const path = industry.slice(0, j);
        const node = {
          title: path[j - 1],
          path,
          subtitle: path.join(' > '),
        };
        const nodeAlreadyExists = !!industrySearchItems.find(
          (item) => item.subtitle === node.subtitle,
        );
        if (!nodeAlreadyExists) industrySearchItems.push(node);
      }
    }
    store.dispatch(search.setIndustries(industrySearchItems));

    // REVIST THIS TREE CONVERSION
    // store.dispatch(explorer.setExplorerIndustryTree(pathArrayToTree(industries)));
    store.dispatch(api.setLoadingState(false));
  },
  [GET_SEARCH_RESULTS]: async (store, payload) => {
    try {
      const searchParams = payload;
      store.dispatch(api.setLoadingState(true));
      const searchResults = await getSearchResults(searchParams);
      store.dispatch(search.setSearchResults(searchResults));

      // Update Profile
      const userProfile = await whoami();
      store.dispatch(user.profile(userProfile));
      AnalyticsService.updateUser(userProfile);

      store.dispatch(api.setLoadingState(false));

      if (userProfile.searchCount === 2) {
        AnalyticsService.trackComplete1SearchEvent();
      }
      if (userProfile.searchCount === 6) {
        AnalyticsService.trackComplete5SearchesEvent();
      }
      AnalyticsService.trackSearch(searchParams);
    } catch (error) {
      // TODO: Handle this error properly
      // console.log('Error', error);
      store.dispatch(
        search.setSearchResults({
          items: [],
          totalCount: 0,
        }),
      );
      store.dispatch(api.setLoadingState(false));
    }
  },
  [SEARCH_GET_NEXT_PAGE]: async (store) => {
    try {
      const {
        SearchFields,
        searchResultFilters,
        page,
        limit,
        resultsItems,
        resultsCount,
      } = store.getState().search;

      const offset = page * limit;
      const searchParams = { ...SearchFields.searchParams, ...searchResultFilters, offset, limit };
      store.dispatch(api.setLoadingState(true));
      store.dispatch(search.setSearchPagination(page + 1));
      const nextPageSearchResults = await getSearchResults(searchParams);
      const mergedSearchResults = [...resultsItems, ...nextPageSearchResults.items];
      store.dispatch(
        search.setSearchResults({
          totalCount: resultsCount,
          items: mergedSearchResults,
        }),
      );
      store.dispatch(api.setLoadingState(false));
      AnalyticsService.trackSearch(searchParams);
    } catch (error) {
      // TODO: Handle this error properly
      // console.log('Error', error);
      store.dispatch(
        search.setSearchResults({
          totalCount: 0,
          items: [],
        }),
      );
      store.dispatch(api.setLoadingState(false));
    }
  },
  [EXPLORER_GET_DISTINCT_INDUSTRIES]: async (store) => {
    try {
      store.dispatch(api.setLoadingState(true));
      const industries = await getDistinctIndustries();

      const industrySearchItems = [];
      for (let i = 0; i < industries.length; i++) {
        const industry = industries[i];
        for (let j = 1; j < industry.length + 1; j++) {
          const path = industry.slice(0, j);
          const node = {
            title: path[j - 1],
            path,
            info: path.join(' > '),
          };
          const nodeAlreadyExists = !!industrySearchItems.find((item) => item.info === node.info);
          if (!nodeAlreadyExists) industrySearchItems.push(node);
        }
      }

      store.dispatch(explorer.setExplorerIndustryTree(pathArrayToTree(industries)));
      store.dispatch(explorer.setExplorerIndustrySearchItems(industrySearchItems));
      store.dispatch(api.setLoadingState(false));
    } catch (error) {
      // TODO: Handle this error properly
      // console.log('Error', error);
      store.dispatch(api.setLoadingState(false));
    }
  },
  // For the Taxonomy Preview Only
  [EXPLORER_GET_DISTINCT_INDUSTRIES_PREVIEW]: async (store) => {
    try {
      store.dispatch(api.setLoadingState(true));
      const industries = await getDistinctIndustriesPreview();
      store.dispatch(explorer.setExplorerIndustryTree(pathArrayToTree(industries)));
      store.dispatch(api.setLoadingState(false));
    } catch (error) {
      // TODO: Handle this error properly
      // console.log('Error', error);
      store.dispatch(api.setLoadingState(false));
    }
  },
  [EXPLORER_SET_LISTS_INDUSTRY]: async (store, payload) => {
    try {
      const industry = payload;

      // If payload is industry has not been set, reset overview
      if (!industry.length) {
        store.dispatch(
          explorer.setExplorerSetOverview({
            industry,
            publishers: [],
            metrics: [],
            segmentations: [],
            statistics: [],
          }),
        );
        return;
      }

      store.dispatch(api.setLoadingState(true));
      const overview = await getIndustryOverview({ industry });
      const { publishers, metrics, statistics } = overview;
      let { segmentations } = overview;
      // Remove null segmentation
      segmentations = segmentations.filter((item) => item || null);

      // Move Statista to end
      let publishersLength = publishers.length;
      for (let i = 0; i < publishersLength; i++) {
        if (publishers[i] === 'Statista') {
          publishers.push(publishers.splice(i, 1)[0]);
          i--;
          publishersLength--;
        }
      }
      store.dispatch(
        explorer.setExplorerSetOverview({
          industry,
          publishers,
          metrics,
          segmentations,
          statistics: statistics || [],
        }),
      );
      store.dispatch(api.setLoadingState(false));
    } catch (error) {
      // TODO: Handle this error properly
      // console.log('Error', error);
      store.dispatch(api.setLoadingState(false));
    }
  },
};

export default (store) => (next) => (action) => {
  if (action.type in handlers && handlers[action.type]) {
    handlers[action.type](store, action.payload);
  }
  return next(action);
};

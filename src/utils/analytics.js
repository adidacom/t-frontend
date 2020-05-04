import amplitude from 'amplitude-js';
import ReactGA from 'react-ga';
import { addContactToHubspot } from './hubspot';

amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY, null, {
  logLevel: 'DISABLE',
});
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

// ENGAGAMENT FUNNEL
const SIGNUP_EVENT = 'signup';
const COMPLETE_REGISTRATION_EVENT = 'completeRegistration';
const COMPLETE_WALKTHROUGH_EVENT = 'completeWalkthrough';
const COMPLETE_1_SEARCH_EVENT = 'complete1Search';
const COMPLETE_5_SEARCHES_EVENT = 'complete5Searches';

const LOGIN_EVENT = 'login';
const LOGOUT_EVENT = 'logout';
const VISIT_EVENT = 'visit';
const VISIT_SEARCH_PAGE_EVENT = 'visitSearchPage';
const VISIT_DASHBOARD_EVENT = 'visitDashboard';
const VISIT_EXPLORER_PAGE_EVENT = 'visitExplorerPage';
const VISIT_TAXONOMY_PREVIEW_PAGE_EVENT = 'visitTaxonomyPreviewPage';
const VISIT_LOGIN_PAGE_EVENT = 'visitLoginPage';
const VISIT_SIGN_UP_PAGE_EVENT = 'visitSignUpPage';
const VISIT_RESET_PASSWORD_PAGE_EVENT = 'visitResetPasswordPage';
const VISIT_SETTINGS_ACCOUNT_SECURITY_PAGE_EVENT = 'visitSettingsAccountSecurityPage';
const VISIT_SETTINGS_USER_PROFILE_PAGE_EVENT = 'visitSettingsUserProfilePage';
const VISIT_UNSUPPORTED_BROWSER_PAGE_EVENT = 'visitUnsupportedBrowserPage';
const DROPDOWN_SELECT_EVENT = 'dropdownSelect';
const SEARCH_EVENT = 'search';
const SEARCH_FROM_EXPLORER_EVENT = 'searchFromExplorer';
const DASHBOARD_SEARCH_EVENT = 'dashboardSearch';
const DASHBOARD_REPORT_CLICK_EVENT = 'dashboardReportClick';
const INTRO_VIDEO_VIEW_EVENT = 'introVideoView';
const EXPLORER_INDUSTRY_SEARCH_EVENT = 'explorerIndustrySearchEvent';
const EXPLORER_NODE_CLICK_EVENT = 'explorerNodeClick';
const REPORT_URL_CLICK_EVENT = 'reportUrlClick';
const CTA_HEADER_CLICK_EVENT = 'ctaHeaderClick';
const CTA_EXPLORER_LIST_CLICK_EVENT = 'ctaExplorerListClick';
const CTA_SEARCH_RESULTS_CLICK_EVENT = 'ctaSearchResultsClick';
const CTA_SEARCH_BUTTON_CLICK_EVENT = 'ctaSearchButtonClick';
const ERROR_EVENT = 'error';
const LOGINS_FIELD = 'logins';
const LOGOUTS_FIELD = 'logouts';
const VISITS_FIELD = 'visits';
const VISITS_DASHBOARD_FIELD = 'visitsDashboard';
const VISITS_SEARCH_PAGE_FIELD = 'visitsSearchPage';
const VISITS_EXPLORER_PAGE_FIELD = 'visitsExplorerPage';
const VISITS_TAXONOMY_PREVIEW_PAGE_FIELD = 'visitsTaxonomyPreviewPage';
const VISITS_SIGN_UP_PAGE_FIELD = 'visitsSignUpPage';
const VISITS_LOGIN_PAGE_FIELD = 'visitsLoginPage';
const VISITS_RESET_PASSWORD_PAGE_FIELD = 'visitsResetPasswordPage';
const VISITS_SETTINGS_ACCOUNT_SECURITY_PAGE_FIELD = 'visitsSettingsAccountSecurityPage';
const VISITS_SETTINGS_USER_PROFILE_PAGE_FIELD = 'visitsSettingsUserProfilePage';
const REPORT_URL_CLICKS_FIELD = 'reportUrlClicks';
const DROPDOWN_SELECTS_FIELD = 'dropdownSelects';
const SEARCHES_FIELD = 'searches';
const SEARCHES_FROM_EXPLORER_FIELD = 'searchesFromExplorer';
const EXPLORER_INDUSTRY_SEARCHES_FIELD = 'explorereIndustrySearchesField';
const EXPLORER_NODE_CLICKS_FIELD = 'explorerNodeClicks';
const CTA_HEADER_CLICKS_FIELD = 'ctaHeaderClicks';
const CTA_EXPLORER_LIST_CLICKS_FIELD = 'ctaExplorerListClicks';
const CTA_SEARCH_RESULTS_CLICKS_FIELD = 'ctaSearchResultsClicks';
const CTA_SEARCH_BUTTON_CLICKS_FIELD = 'ctaSearchButtonClicks';

export function identifyUser(userId) {
  amplitude.getInstance().setUserId(userId);
  ReactGA.set({ userId });
}

export function updateUser(userProfile) {
  amplitude.getInstance().setUserId(userProfile.id);
  amplitude.getInstance().setUserProperties({
    ...userProfile,
    industriesEnabled: JSON.stringify(userProfile.industriesEnabled),
  });
}

export async function trackSignup(userProfile) {
  amplitude.getInstance().setUserId(userProfile.id);
  amplitude.getInstance().setUserProperties({
    ...userProfile,
    industriesEnabled: JSON.stringify(userProfile.industriesEnabled),
  });

  const { email } = userProfile;
  const campaign = 'Organic';
  const medium = 'Web App';
  const source = 'T4 Sign Up Page';
  const pageName = 'T4 Sign Up Page';

  amplitude.getInstance().logEvent(SIGNUP_EVENT, {
    campaign,
    medium,
    source,
  });

  await addContactToHubspot({ email, source, medium, campaign, pageName });

  ReactGA.set({ userId: userProfile.id });
  ReactGA.event({
    category: 'Users',
    action: 'Signup',
    label: 'Signup',
  });
}

export function trackCompleteRegistrationEvent() {
  amplitude.getInstance().logEvent(COMPLETE_REGISTRATION_EVENT);
  ReactGA.event({
    category: 'Users',
    label: 'Completed Registration',
    action: 'Completed Registration',
  });
}

export function trackCompleteWalkthroughEvent() {
  amplitude.getInstance().logEvent(COMPLETE_WALKTHROUGH_EVENT);
  ReactGA.event({
    category: 'User Engagement',
    label: 'Completed Walkthrough',
    action: 'Completed Walkthrough',
  });
}

export function trackComplete1SearchEvent() {
  amplitude.getInstance().logEvent(COMPLETE_1_SEARCH_EVENT);
  ReactGA.event({
    category: 'User Engagement',
    label: 'Completed 1 Search',
    action: 'Completed 1 Search',
  });
}

export function trackComplete5SearchesEvent() {
  amplitude.getInstance().logEvent(COMPLETE_5_SEARCHES_EVENT);
  ReactGA.event({
    category: 'User Engagement',
    label: 'Completed 5 Searches',
    action: 'Completed 5 Searches',
  });
}

export function trackLogin(userId) {
  amplitude.getInstance().setUserId(userId);
  const identify = new amplitude.Identify().add(LOGINS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(LOGIN_EVENT);
  ReactGA.set({ userId });
}

export function trackLogout() {
  const identify = new amplitude.Identify().add(LOGOUTS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(LOGOUT_EVENT);

  amplitude.getInstance().setUserId(null);
  // Not clearing device id
  // amplitude.getInstance().regenerateDeviceId();
}

export function trackVisit() {
  const identify = new amplitude.Identify().add(VISITS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(VISIT_EVENT);
}

export function trackVisitSearchPage() {
  const identify = new amplitude.Identify().add(VISITS_SEARCH_PAGE_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(VISIT_SEARCH_PAGE_EVENT);
}

export function trackVisitDashboard() {
  const identify = new amplitude.Identify().add(VISITS_DASHBOARD_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(VISIT_DASHBOARD_EVENT);
}

export function trackVisitExplorerPage() {
  const identify = new amplitude.Identify().add(VISITS_EXPLORER_PAGE_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(VISIT_EXPLORER_PAGE_EVENT);
}

export function trackVisitTaxonomyPreviewPage() {
  const identify = new amplitude.Identify().add(VISITS_TAXONOMY_PREVIEW_PAGE_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(VISIT_TAXONOMY_PREVIEW_PAGE_EVENT);
}

export function trackVisitLoginPage() {
  const identify = new amplitude.Identify().add(VISITS_LOGIN_PAGE_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(VISIT_LOGIN_PAGE_EVENT);
}

export function trackVisitSignUpPage() {
  const identify = new amplitude.Identify().add(VISITS_SIGN_UP_PAGE_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(VISIT_SIGN_UP_PAGE_EVENT);
}

export function trackVisitResetPasswordPage() {
  const identify = new amplitude.Identify().add(VISITS_RESET_PASSWORD_PAGE_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(VISIT_RESET_PASSWORD_PAGE_EVENT);
}

export function trackVisitSettingsAccountSecurityPage() {
  const identify = new amplitude.Identify().add(VISITS_SETTINGS_ACCOUNT_SECURITY_PAGE_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(VISIT_SETTINGS_ACCOUNT_SECURITY_PAGE_EVENT);
}

export function trackVisitSettingsUserProfilePage() {
  const identify = new amplitude.Identify().add(VISITS_SETTINGS_USER_PROFILE_PAGE_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(VISIT_SETTINGS_USER_PROFILE_PAGE_EVENT);
}

export function trackVisitUnsupportedBrowserPage() {
  amplitude.getInstance().logEvent(VISIT_UNSUPPORTED_BROWSER_PAGE_EVENT);
}

export function trackError(error) {
  amplitude.getInstance().logEvent(ERROR_EVENT, error);
}

export function trackDropdownSelect(field, selection) {
  const identify = new amplitude.Identify().add(DROPDOWN_SELECTS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(DROPDOWN_SELECT_EVENT, { field, selection });
  ReactGA.event({
    category: 'engagement',
    label: 'search',
    action: DROPDOWN_SELECT_EVENT,
  });
}

export function trackSearch(searchParams) {
  const identify = new amplitude.Identify().add(SEARCHES_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(SEARCH_EVENT, {
    ...searchParams,
    paramsFlat: JSON.stringify(searchParams),
    industry: JSON.stringify(searchParams.industry),
    segmentation: JSON.stringify(searchParams.segmentation),
  });
  ReactGA.event({
    category: 'engagement',
    label: 'search',
    action: SEARCH_EVENT,
  });
}

export function trackSearchFromExplorer(searchParams) {
  const identify = new amplitude.Identify().add(SEARCHES_FROM_EXPLORER_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(SEARCH_FROM_EXPLORER_EVENT, {
    ...searchParams,
    paramsFlat: JSON.stringify(searchParams),
    industry: JSON.stringify(searchParams.industry),
    segmentation: JSON.stringify(searchParams.segmentation),
  });
  ReactGA.event({
    category: 'engagement',
    label: 'explorer',
    action: SEARCH_FROM_EXPLORER_EVENT,
  });
}
export function trackExplorerIndustrySearch(industry) {
  const identify = new amplitude.Identify().add(EXPLORER_INDUSTRY_SEARCHES_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(EXPLORER_INDUSTRY_SEARCH_EVENT, {
    industry: JSON.stringify(industry),
  });
  ReactGA.event({
    category: 'engagement',
    label: 'explorer',
    action: EXPLORER_INDUSTRY_SEARCH_EVENT,
  });
}

export function trackExplorerNodeClick(industry) {
  const identify = new amplitude.Identify().add(EXPLORER_NODE_CLICKS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(EXPLORER_NODE_CLICK_EVENT, {
    industry: JSON.stringify(industry),
  });
  ReactGA.event({
    category: 'engagement',
    label: 'explorer',
    action: EXPLORER_NODE_CLICK_EVENT,
  });
}

export function trackReportUrlClick(ReportId, reportName, url, searchParams) {
  const identify = new amplitude.Identify().add(REPORT_URL_CLICKS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(REPORT_URL_CLICK_EVENT, {
    ReportId,
    reportName,
    url,
    searchParams: {
      ...searchParams,
      paramsFlat: JSON.stringify(searchParams),
      industry: JSON.stringify(searchParams.industry),
      segmentation: JSON.stringify(searchParams.segmentation),
    },
  });
  ReactGA.event({
    category: 'engagement',
    label: 'search',
    action: REPORT_URL_CLICK_EVENT,
  });
}

export function trackDashboardSearch(title, searchParams) {
  amplitude.getInstance().logEvent(DASHBOARD_SEARCH_EVENT, {
    title,
    searchParams: {
      ...searchParams,
      paramsFlat: JSON.stringify(searchParams),
      industry: JSON.stringify(searchParams.industry),
      segmentation: JSON.stringify(searchParams.segmentation),
    },
  });
  ReactGA.event({
    category: 'engagement',
    label: 'dashboard',
    action: DASHBOARD_SEARCH_EVENT,
  });
}

export function trackDashboardReportClick(reportName, url) {
  const identify = new amplitude.Identify().add(REPORT_URL_CLICKS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(DASHBOARD_REPORT_CLICK_EVENT, {
    reportName,
    url,
  });
  ReactGA.event({
    category: 'engagement',
    label: 'dashboard',
    action: DASHBOARD_REPORT_CLICK_EVENT,
  });
}

export function trackIntroVideoView(secondsWatched) {
  amplitude.getInstance().logEvent(INTRO_VIDEO_VIEW_EVENT, { secondsWatched });
  ReactGA.event({
    category: 'User Engagement',
    label: 'Watched Intro Video',
    action: 'Watched Intro Video',
  });
}

export function trackCTAHeaderClick() {
  const identify = new amplitude.Identify().add(CTA_HEADER_CLICKS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(CTA_HEADER_CLICK_EVENT);
  ReactGA.event({
    category: 'trialUpgrade',
    label: 'trialCTA',
    action: CTA_HEADER_CLICK_EVENT,
  });
}

export function trackCTAExplorerListClick() {
  const identify = new amplitude.Identify().add(CTA_EXPLORER_LIST_CLICKS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(CTA_EXPLORER_LIST_CLICK_EVENT);
  ReactGA.event({
    category: 'trialUpgrade',
    label: 'trialCTA',
    action: CTA_EXPLORER_LIST_CLICK_EVENT,
  });
}

export function trackCTASearchResultsClick() {
  const identify = new amplitude.Identify().add(CTA_SEARCH_RESULTS_CLICKS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(CTA_SEARCH_RESULTS_CLICK_EVENT);
  ReactGA.event({
    category: 'trialUpgrade',
    label: 'trialCTA',
    action: CTA_SEARCH_RESULTS_CLICK_EVENT,
  });
}

export function trackCTASearchButtonClick() {
  const identify = new amplitude.Identify().add(CTA_SEARCH_BUTTON_CLICKS_FIELD, 1);
  amplitude.getInstance().identify(identify);
  amplitude.getInstance().logEvent(CTA_SEARCH_BUTTON_CLICK_EVENT);
  ReactGA.event({
    category: 'trialUpgrade',
    label: 'trialCTA',
    action: CTA_SEARCH_BUTTON_CLICK_EVENT,
  });
}

export function gaTrackPageVisit() {
  ReactGA.pageview(window.location.pathname + window.location.search);
}

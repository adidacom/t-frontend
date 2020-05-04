import qs from 'qs';
import { getToken } from './token';
import * as AnalyticsService from './analytics';

export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';

export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const UNPROCESSABLE_ENTITY = 422;
export const SERVER_ERROR = 500;

// Most errors unused for now
const ERRORS = {
  [BAD_REQUEST]: {
    authenticate: 'Sorry, we couldn’t verify your password',
    signUp: 'An account with this email already exists',
    default: 'Wrong parameters',
  },
  [UNAUTHORIZED]: {
    generateResetPasswordToken: 'Please complete your account',
    default: 'You are not authorized',
  },
  [FORBIDDEN]: {
    default: 'Forbidden',
  },
  [NOT_FOUND]: {
    default: 'User was not found.',
  },
  [UNPROCESSABLE_ENTITY]: {
    signUp: 'An account with this email already exists',
    default: 'Unprocessable entity.',
  },
  [SERVER_ERROR]: {
    default: 'Internal server error.',
  },
};

const apiUrlBase = process.env.REACT_APP_T4_BACKEND_URL;
const endpoints = {
  // Authorization
  login: '/auth/login',

  // User
  signUp: '/user/signup',
  verifyEmail: '/user/verifyemail',
  me: '/me',
  profile: '/user/profile',
  changePassword: '/user/changepassword',
  resetPassword: '/user/resetpassword',
  supportTicket: '/user/supportticket',

  // Access Code
  checkAccessCode: '/accesscode/check',
  activateAccessCode: '/accesscode/activate',

  // ADMIN ONLY Access Code
  accessCode: '/accesscode',
  allAccessCodes: '/accesscode/all',

  // Search
  search: '/search',
  dropdown: '/search/dropdown',
  reportUrlClicked: '/search/reporturlclicked',

  // Explorer
  explorerIndustries: '/explorer/industries',
  explorerIndustriesPreview: '/explorer/industriespreview',
  explorerPublishers: '/explorer/publishers',
  explorerMetrics: '/explorer/metrics',
  explorerSegmentations: '/explorer/segmentations',
  explorerOverview: '/explorer/overview',

  // Company
  company: '/company',
  companyByRef: '/company/ref',

  // Version
  vFE: '/v/fe',
};

async function error(response, endpoint, useErrorMessage) {
  const errorBody = await response.json();
  AnalyticsService.trackError({
    error: errorBody.message,
    endpoint,
  });

  if (ERRORS[response.status] && ERRORS[response.status][endpoint] !== null) {
    const nonNativeError = ERRORS[response.status][endpoint]
      ? ERRORS[response.status][endpoint]
      : ERRORS[response.status].default;

    return [response.status, useErrorMessage ? errorBody.message : nonNativeError, endpoint];
  }
  return [response.status, 'Unknown error'];
}

function apiUrl(endpoint) {
  if (endpoint in endpoints) {
    return apiUrlBase + endpoints[endpoint];
  }
  return endpoint;
}

const headers = {
  'Content-Type': 'application/json',
};

function token() {
  return `Bearer ${getToken()}`;
}

function apiCall(
  endpoint,
  method = GET,
  data = {},
  adheaders = {},
  forceQueryString = false,
  appendToUrl = '',
) {
  const payload = {
    method,
    headers: Object.assign({}, headers, adheaders),
  };
  if (method !== GET) {
    payload.body = JSON.stringify(data);
  }

  let url = `${apiUrl(endpoint)}${appendToUrl}`;

  // Check if we need to add Query Parameters
  if (
    (method === GET || forceQueryString) &&
    Object.keys(data).length !== 0 &&
    data.constructor === Object
  ) {
    const queryString = qs.stringify(data);
    url = `${url}?${queryString}`;
  }

  return fetch(url, payload);
}

export function signUp(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('signUp', POST, {
        email,
        password,
      });
      if (response.ok) {
        const payload = await response.json();
        return resolve(payload);
      }
      return reject(await error(response, 'signUp'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function resendVerificationEmail() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('verifyEmail', GET, {}, { Authorization: token() });
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'resendVerificationEmail'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function verifyEmail(emailVerificationCode) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'verifyEmail',
        PUT,
        {
          emailVerificationCode,
        },
        { Authorization: token() },
      );
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'verifyEmail'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function createAccessCode(code, data, numTotalUses, expiresAt = null, notes = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'accessCode',
        POST,
        { code, data, numTotalUses, expiresAt, notes },
        { Authorization: token() },
      );
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'createAccessCode'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getAllAccessCodes() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('allAccessCodes', GET, {}, { Authorization: token() });
      if (response.ok) {
        const payload = await response.json();
        return resolve(payload);
      }
      return reject(await error(response, 'getAllAccessCodes'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function checkAccessCode(code) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'checkAccessCode',
        GET,
        {
          code,
        },
        { Authorization: token() },
      );
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'checkAccessCode'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function activateAccessCode(code) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'activateAccessCode',
        PUT,
        {
          code,
        },
        { Authorization: token() },
        true,
      );
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'checkAccessCode'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function login(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('login', POST, {
        email,
        password,
      });
      if (response.ok) {
        const payload = await response.json();
        return resolve(payload.token);
      }
      // TODO: Improve this
      return reject(await error(response, 'login', true));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function changePassword(oldPassword, newPassword) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'changePassword',
        PUT,
        {
          oldPassword,
          newPassword,
        },
        { Authorization: token() },
      );
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'changePassword'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function generateResetPasswordToken(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('resetPassword', POST, {
        email,
      });
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'generateResetPasswordToken'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function checkResetPasswordToken(resetPasswordToken) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('resetPassword', GET, { token: resetPasswordToken });
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'checkResetPasswordToken'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function resetPassword(email, password, resetPasswordToken) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('resetPassword', PUT, {
        email,
        password,
        token: resetPasswordToken,
      });
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'resetPassword'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function updateProfile(userProfile) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('profile', PUT, userProfile, { Authorization: token() });
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'updateProfile'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function createSupportTicket(subject, description) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'supportTicket',
        POST,
        { subject, description },
        { Authorization: token() },
      );
      if (response.ok) {
        const success = await response.json();
        return resolve(success);
      }
      return reject(await error(response, 'supportTicket'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function whoami() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('me', GET, {}, { Authorization: token() });
      if (response.ok) {
        const profile = await response.json();
        return resolve(profile);
      }
      return reject(await error(response, 'profile'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getDropdown(searchParams, column, colSubIndex) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'dropdown',
        GET,
        { ...searchParams, column, colSubIndex },
        { Authorization: token() },
      );
      if (response.ok) {
        const dropdownList = await response.json();

        return resolve(dropdownList);
      }
      return reject(await error(response, 'dropdown'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getSearchResults(searchParams) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('search', GET, searchParams, { Authorization: token() });
      if (response.ok) {
        const searchResults = await response.json();
        return resolve(searchResults);
      }
      return reject(await error(response, 'search'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function reportUrlClicked(ReportId, name, url, ReportBranchId, searchParams) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'reportUrlClicked',
        POST,
        {
          ReportId,
          name,
          url,
          ReportBranchId,
          searchParams,
        },
        { Authorization: token() },
      );
      if (response.ok) {
        return resolve(true);
      }
      return reject(await error(response, 'reportUrlClicked'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getDistinctIndustries() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('explorerIndustries', GET, {}, { Authorization: token() });
      if (response.ok) {
        const industries = await response.json();
        return resolve(industries);
      }
      return reject(await error(response, 'explorer industries'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getDistinctIndustriesPreview() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('explorerIndustriesPreview', GET);
      if (response.ok) {
        const industries = await response.json();
        return resolve(industries);
      }
      return reject(await error(response, 'explorer industries'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getIndustryPublishers(searchParams) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'explorerPublishers',
        GET,
        { searchParams },
        { Authorization: token() },
      );
      if (response.ok) {
        const publishers = await response.json();
        return resolve(publishers);
      }
      return reject(await error(response, 'explorer publishers'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getIndustryMetrics(searchParams) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'explorerMetrics',
        GET,
        { searchParams },
        { Authorization: token() },
      );
      if (response.ok) {
        const metrics = await response.json();

        return resolve(metrics);
      }
      return reject(await error(response, 'explorer metrics'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getIndustrySegmentations(searchParams) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'explorerSegmentations',
        GET,
        { searchParams },
        { Authorization: token() },
      );
      if (response.ok) {
        const segmentations = await response.json();

        return resolve(segmentations);
      }
      return reject(await error(response, 'explorer segmentations'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getIndustryOverview(searchParams) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'explorerOverview',
        GET,
        { searchParams },
        { Authorization: token() },
      );
      if (response.ok) {
        const overview = await response.json();

        return resolve(overview);
      }
      return reject(await error(response, 'explorer overview'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getCompanyById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'company',
        GET,
        {},
        { Authorization: token() },
        false,
        `/${id}`,
      );
      if (response.ok) {
        const company = await response.json();
        return resolve(company);
      }
      return reject(await error(response, 'company by id'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getCompanyByRef(ref) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall(
        'companyByRef',
        GET,
        {},
        { Authorization: token() },
        false,
        `/${ref}`,
      );
      if (response.ok) {
        const company = await response.json();
        return resolve(company);
      }
      return reject(await error(response, 'company by ref'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getCompanyListForSearching() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('company', GET, {}, { Authorization: token() });
      if (response.ok) {
        const companiesList = await response.json();
        return resolve(companiesList);
      }
      return reject(await error(response, 'company list for searching'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

export function getFrontendVersion() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiCall('vFE', GET, {});
      if (response.ok) {
        const vFE = await response.json();
        return resolve(vFE);
      }
      return reject(await error(response, 'getting fe version'));
    } catch (e) {
      return reject(new Error('Network error'));
    }
  });
}

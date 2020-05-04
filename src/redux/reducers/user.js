import {
  USER_PROFILE,
  USER_SET_PROFILE,
  SET_RESET_PASSWORD_TOKEN_VALID,
  USER_SET_ERROR,
} from '../types';

const initialState = {
  resetTokenValid: false,
  error: null,
};

const getMainIndustrySubscription = (industriesEnabled) => industriesEnabled[0];

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_PROFILE:
      if (action.payload == null) {
        return {
          resetTokenValid: false,
          error: null,
        };
      }
      return {
        ...state,
        ...action.payload,
        mainIndustrySubscription: getMainIndustrySubscription(action.payload.industriesEnabled),
      };
    case USER_SET_PROFILE:
      return {
        ...state,
        ...action.payload,
      };
    case USER_SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case SET_RESET_PASSWORD_TOKEN_VALID:
      return {
        ...state,
        resetTokenValid: action.payload,
      };
    default:
      return state;
  }
}

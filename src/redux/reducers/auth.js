import { INIT_APP, SET_AUTH_STATE, SET_TOKEN, LOGIN, LOGOUT, LOGIN_ERROR } from '../types';
import { INITIALIZED, LOGGED_OUT } from '../../utils/auth';

const initialState = {
  authState: INITIALIZED,
  loginError: null,
  token: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT_APP:
      return {
        ...state,
      };
    case SET_AUTH_STATE:
      return {
        ...state,
        authState: action.payload,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case LOGIN:
      return {
        ...state,
        loginError: null,
      };
    case LOGOUT:
      return {
        ...state,
        authState: LOGGED_OUT,
        token: null,
        loginError: null,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loginError: action.payload,
      };
    default:
      return state;
  }
}

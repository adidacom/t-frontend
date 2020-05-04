import { createAction } from 'redux-actions';
import { INIT_APP, SET_AUTH_STATE, SET_TOKEN, LOGIN, LOGOUT, LOGIN_ERROR } from '../types';

export const init = createAction(INIT_APP);
export const setAuthState = createAction(SET_AUTH_STATE, (payload) => payload);
export const setToken = createAction(SET_TOKEN, (payload) => payload);
export const login = createAction(LOGIN, (payload) => payload);
export const logout = createAction(LOGOUT);
export const loginError = createAction(LOGIN_ERROR, (payload) => payload);

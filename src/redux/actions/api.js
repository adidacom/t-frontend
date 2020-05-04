import { createAction } from 'redux-actions';

import { SET_LOADING_STATE } from '../types';

export const setLoadingState = createAction(SET_LOADING_STATE, (payload) => payload);

import { SET_LOADING_STATE } from '../types';

const initialState = {
  loading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_STATE:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

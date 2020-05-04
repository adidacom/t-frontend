import { COMPANY_GET_SUCCESS, COMPANY_GET_SEARCH_ITEMS_SUCCESS, COMPANY_ERROR } from '../types';

const initialState = {
  loadedCompany: null,
  companySearchItems: [],
  error: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case COMPANY_GET_SUCCESS:
      return {
        ...state,
        loadedCompany: action.payload,
      };
    case COMPANY_GET_SEARCH_ITEMS_SUCCESS:
      return {
        ...state,
        companySearchItems: action.payload,
      };
    case COMPANY_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

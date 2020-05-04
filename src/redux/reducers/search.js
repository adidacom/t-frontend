/* eslint-disable no-case-declarations */
import {
  SEARCH_SET_INDUSTRIES,
  SEARCH_SET_FIELDS_UPDATE_HASH,
  SEARCH_FIELDS,
  SEARCH_SET_RESULT_FILTERS,
  GET_SEARCH_RESULTS,
  SET_SEARCH_RESULTS,
  SEARCH_SET_PAGINATION,
  SEARCH_SET_PRISTINE,
} from '../types';

import SearchFields from '../../utils/SearchFields';

const initialState = {
  industries: [],
  SearchFields: new SearchFields(),
  isPristineSearch: true,
  searchResultFilters: {},
  fieldsUpdateHash: '',
  lastSearchUpdateSource: '',
  page: 1,
  limit: 20,
  resultsCount: 0,
  resultsItems: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_SET_INDUSTRIES:
      return {
        ...state,
        industries: action.payload,
      };
    case SEARCH_SET_FIELDS_UPDATE_HASH:
      return {
        ...state,
        fieldsUpdateHash: action.payload,
      };
    case SEARCH_FIELDS:
      return {
        ...state,
        SearchFields: action.payload,
      };
    case SEARCH_SET_RESULT_FILTERS:
      return {
        ...state,
        searchResultFilters: action.payload,
        lastSearchUpdateSource: action.payload.eventSource,
      };
    case GET_SEARCH_RESULTS:
      return {
        ...state,
        page: initialState.page,
        searchParams: action.payload,
      };
    case SEARCH_SET_PAGINATION:
      return {
        ...state,
        page: action.payload,
        lastSearchUpdateSource: 'pagination',
      };
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        resultsCount: action.payload.totalCount,
        resultsItems: action.payload.items,
        isPristineSearch: false,
      };
    case SEARCH_SET_PRISTINE:
      return {
        ...state,
        isPristineSearch: true,
        resultsCount: 0,
        resultsItems: [],
        lastSearchUpdateSource: '',
      };
    default:
      return state;
  }
}

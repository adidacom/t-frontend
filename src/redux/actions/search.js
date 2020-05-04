import { createAction } from 'redux-actions';

import {
  SEARCH_INITIAL_LOAD,
  SEARCH_SET_INDUSTRIES,
  SEARCH_SET_FIELDS_UPDATE_HASH,
  GET_SEARCH_RESULTS,
  SET_SEARCH_RESULTS,
  SEARCH_SET_RESULT_FILTERS,
  SEARCH_DROPDOWN,
  SEARCH_FIELDS,
  SEARCH_SET_PAGINATION,
  SEARCH_GET_NEXT_PAGE,
  SEARCH_SET_PRISTINE,
} from '../types';

export const getIndustries = createAction(SEARCH_INITIAL_LOAD, (payload) => payload);
export const setIndustries = createAction(SEARCH_SET_INDUSTRIES, (payload) => payload);
export const setFieldsUpdateHash = createAction(
  SEARCH_SET_FIELDS_UPDATE_HASH,
  (payload) => payload,
);
export const setSearchResultFilters = createAction(SEARCH_SET_RESULT_FILTERS, (payload) => payload);
export const getSearchResults = createAction(GET_SEARCH_RESULTS, (payload) => payload);
export const setSearchResults = createAction(SET_SEARCH_RESULTS, (payload) => payload);
export const getSearchResultsNextPage = createAction(SEARCH_GET_NEXT_PAGE, (payload) => payload);
export const setSearchPagination = createAction(SEARCH_SET_PAGINATION, (payload) => payload);
export const setSearchPristine = createAction(SEARCH_SET_PRISTINE);

// OLD STUFF
export const getDropdown = createAction(SEARCH_DROPDOWN, (payload) => payload);
export const setSearchFields = createAction(SEARCH_FIELDS, (payload) => payload);

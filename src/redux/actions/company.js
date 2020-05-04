import { createAction } from 'redux-actions';
import {
  COMPANY_GET,
  COMPANY_GET_SUCCESS,
  COMPANY_GET_SEARCH_ITEMS,
  COMPANY_GET_SEARCH_ITEMS_SUCCESS,
  COMPANY_ERROR,
} from '../types';

export const companyGet = createAction(COMPANY_GET, (payload) => payload);
export const companyGetSuccess = createAction(COMPANY_GET_SUCCESS, (payload) => payload);
export const companyGetSearchItems = createAction(COMPANY_GET_SEARCH_ITEMS, (payload) => payload);
export const companyGetSearchItemsSuccess = createAction(
  COMPANY_GET_SEARCH_ITEMS_SUCCESS,
  (payload) => payload,
);
export const companySetError = createAction(COMPANY_ERROR, (payload) => payload);

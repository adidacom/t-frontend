import { combineReducers } from 'redux';
import apiReducer from './reducers/api';
import authReducer from './reducers/auth';
import companyReducer from './reducers/company';
import explorerReducer from './reducers/explorer';
import searchReducer from './reducers/search';
import userReducer from './reducers/user';
import middleware from './middleware/t4';

export * from './actions/api';
export * from './actions/auth';
export * from './actions/company';
export * from './actions/explorer';
export * from './actions/search';
export * from './actions/user';
export const t4Middleware = middleware;

const rootReducer = combineReducers({
  api: apiReducer,
  auth: authReducer,
  company: companyReducer,
  explorer: explorerReducer,
  search: searchReducer,
  user: userReducer,
});

export default rootReducer;

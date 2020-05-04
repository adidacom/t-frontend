import { createAction } from 'redux-actions';

import {
  EXPLORER_GET_DISTINCT_INDUSTRIES,
  EXPLORER_GET_DISTINCT_INDUSTRIES_PREVIEW,
  EXPLORER_SET_LISTS_INDUSTRY,
  EXPLORER_INDUSTRY_TREE,
  EXPLORER_INDUSTRY_SEARCH_ITEMS,
  EXPLORER_SET_PUBLISHERS,
  EXPLORER_SET_METRICS,
  EXPLORER_SET_SEGMENTATIONS,
  EXPLORER_SET_OVERVIEW,
} from '../types';

export const getExplorerDistinctIndustries = createAction(
  EXPLORER_GET_DISTINCT_INDUSTRIES,
  (payload) => payload,
);
export const getExplorerDistinctIndustriesPreview = createAction(
  EXPLORER_GET_DISTINCT_INDUSTRIES_PREVIEW,
  (payload) => payload,
);
export const setExplorerListsIndustry = createAction(
  EXPLORER_SET_LISTS_INDUSTRY,
  (payload) => payload,
);
export const setExplorerIndustryTree = createAction(EXPLORER_INDUSTRY_TREE, (payload) => payload);
export const setExplorerIndustrySearchItems = createAction(
  EXPLORER_INDUSTRY_SEARCH_ITEMS,
  (payload) => payload,
);
export const setExplorerPublishers = createAction(EXPLORER_SET_PUBLISHERS, (payload) => payload);
export const setExplorerSetMetrics = createAction(EXPLORER_SET_METRICS, (payload) => payload);
export const setExplorerSetSegmentations = createAction(
  EXPLORER_SET_SEGMENTATIONS,
  (payload) => payload,
);
export const setExplorerSetOverview = createAction(EXPLORER_SET_OVERVIEW, (payload) => payload);

import {
  EXPLORER_SET_LISTS_INDUSTRY,
  EXPLORER_INDUSTRY_TREE,
  EXPLORER_INDUSTRY_SEARCH_ITEMS,
  EXPLORER_SET_PUBLISHERS,
  EXPLORER_SET_METRICS,
  EXPLORER_SET_SEGMENTATIONS,
  EXPLORER_SET_OVERVIEW,
} from '../types';

const initialState = {
  listsIndustry: [],
  loadedIndustry: [],
  industryTree: {},
  industrySearchItems: [],
  industryPublishers: [],
  industryMetrics: [],
  industrySegmentations: [],
  industryStatistics: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case EXPLORER_SET_LISTS_INDUSTRY:
      return {
        ...state,
        listsIndustry: action.payload,
      };
    case EXPLORER_INDUSTRY_TREE:
      return {
        ...state,
        industryTree: action.payload,
      };
    case EXPLORER_INDUSTRY_SEARCH_ITEMS:
      return {
        ...state,
        industrySearchItems: action.payload,
      };
    case EXPLORER_SET_PUBLISHERS:
      return {
        ...state,
        industryPublishers: action.payload,
      };
    case EXPLORER_SET_METRICS:
      return {
        ...state,
        industryMetrics: action.payload,
      };
    case EXPLORER_SET_SEGMENTATIONS:
      return {
        ...state,
        industrySegmentations: action.payload,
      };
    case EXPLORER_SET_OVERVIEW:
      return {
        ...state,
        industryPublishers: action.payload.publishers,
        industryMetrics: action.payload.metrics,
        industrySegmentations: action.payload.segmentations,
        industryStatistics: action.payload.statistics,
        loadedIndustry: action.payload.industry,
      };
    default:
      return state;
  }
}

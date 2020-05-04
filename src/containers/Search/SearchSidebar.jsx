import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import qs from 'qs';
import {
  setFieldsUpdateHash,
  setExplorerIndustryTree,
  getSearchResults,
  setSearchPristine,
  setSearchResultFilters,
} from '../../redux';
import SearchSelectGroup from '../../components/SearchSelect/SearchSelectGroup';
import SearchSelect from '../../components/SearchSelect/SearchSelect';
import { SELECT_ICON_TYPES } from '../../components/SearchSelect/SelectIcon';
import Checkbox from '../../components/common/Checkbox';
import Taxonomy from '../../components/Taxonomy/Taxonomy';
import { COLORS } from '../../utils/theme';
import { pathArrayToTree, sleep } from '../../utils/tools';

const styles = {
  container: {
    padding: 24,
  },
  sectionContainer: {
    '&:not(:last-child)': {
      marginBottom: 40,
    },
  },
  industryCheckboxContainer: {
    marginTop: 12,
  },
  searchLabels: {
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.BASIC800,
  },
};

const PLACEHOLDERS = {
  INDUSTRY: {
    FIRST: 'EX. FIREWALL OR VPN',
    GENERAL: 'Add a subindustry',
  },
  METRIC: {
    GENERAL: 'EX. SALES OR STATISTICS',
  },
  SEGMENT: {
    FIRST: 'EX. REGION OR VENDOR',
    GENERAL: 'Add a segmentation',
  },
};

const INITIAL_IS_LOADING = {
  industry: [],
  metric: false,
  segment: [],
};

const SEARCH_PARAM_KEYS = ['industry', 'excludeSubindustries', 'metric', 'segmentation'];
const RESULT_FILTER_KEYS = ['sortField', 'sortOrder', 'quickFilter', 'freeReportsOnly'];

const SearchSidebar = ({
  classes,
  history,
  searchReducer,
  userReducer,
  onSearchFieldsChange,
  loadTaxonomyTree,
  performSearch,
  setResultFilters,
  resetSearchResultFilters,
  makeSearchPristine,
}) => {
  const { SearchFields, resultsContainerRef } = searchReducer;
  const { mainIndustrySubscription } = userReducer;

  const [isLoading, setIsLoading] = useState(INITIAL_IS_LOADING);

  const updateIsLoading = (value, key, index) => {
    if (index === undefined) {
      setIsLoading({
        [key]: value,
      });
    } else {
      const isLoadingValue = [];
      isLoadingValue[index] = value;
      setIsLoading({
        ...isLoading,
        [key]: isLoadingValue,
      });
    }
  };

  const runSearch = async (resultFilters, pushToHistory = true) => {
    // TODO: IMPROVE THIS!
    searchReducer.lastSearchUpdateSource = 'sidebar';

    !resultFilters && resetSearchResultFilters();
    const { searchParams } = SearchFields;

    const allParams = { ...searchParams, ...resultFilters };

    pushToHistory && history.push(`/search?${qs.stringify(allParams)}`);
    await sleep(200);
    if (resultsContainerRef && resultsContainerRef.current) {
      resultsContainerRef.current.scrollTop = 0;
    }
    performSearch(allParams);
  };

  const handleIndustryChange = async (industryLevel, item, updateSearch = true) => {
    updateIsLoading(true, 'industry', industryLevel);
    let updateHash;
    if (industryLevel === 0) {
      updateHash = await SearchFields.industryL0Changed(item);
      if (!item) {
        updateIsLoading(true, 'industry', industryLevel);
        onSearchFieldsChange(updateHash);
        updateIsLoading(false, 'industry', industryLevel);
        makeSearchPristine();
        history.push('/search');
        return;
      }
    } else {
      updateHash = await SearchFields.industrySelectionChanged(industryLevel, item && item.title);
    }
    onSearchFieldsChange(updateHash);
    updateIsLoading(false, 'industry', industryLevel);
    if (updateSearch) {
      await sleep(400);
      runSearch();
    }
  };

  const handleIndustryIconClick = async (industryLevel) => {
    // An existing industry level was cleared
    await sleep(400);
    if (industryLevel === 0) {
      updateIsLoading(true, 'industry', industryLevel);
      const updateHash = await SearchFields.industryL0Changed(null);
      onSearchFieldsChange(updateHash);
      updateIsLoading(false, 'industry', industryLevel);
      makeSearchPristine();
      history.push('/search');
    } else if (industryLevel < SearchFields.industry.length) {
      updateIsLoading(true, 'industry', industryLevel);
      const updateHash = await SearchFields.industrySelectionChanged(industryLevel, null);
      onSearchFieldsChange(updateHash);
      updateIsLoading(false, 'industry', industryLevel);
      runSearch();
    }
  };

  const handleExcludeSubindustriesClick = async (updateSearch = true) => {
    updateIsLoading(true, 'industry', SearchFields.industry.length - 1);
    const updateHash = await SearchFields.excludeSubindustriesChanged(
      !SearchFields.excludeSubindustries,
    );
    onSearchFieldsChange(updateHash);
    updateIsLoading(false, 'industry', SearchFields.industry.length - 1);
    updateSearch && runSearch();
  };

  // TODO: Make method more uniform. Maybe wrap metric into MetricSelect
  const handleMetricChange = async (item, updateSearch = true) => {
    updateIsLoading(true, 'metric');
    const updateHash = await SearchFields.metricSelectionChanged(item && item.title);
    onSearchFieldsChange(updateHash);
    updateIsLoading(false, 'metric');
    updateSearch && runSearch();
  };

  const handleMetricIconClick = async () => {
    // An existing industry level was cleared
    if (SearchFields.metric) {
      updateIsLoading(true, 'metric');
      const updateHash = await SearchFields.metricSelectionChanged(null);
      onSearchFieldsChange(updateHash);
      updateIsLoading(false, 'metric');
      runSearch();
    }
  };

  const handleSegmentChange = async (segmentLevel, item, updateSearch = true) => {
    updateIsLoading(true, 'segment', segmentLevel);
    const updateHash = await SearchFields.segmentSelectionChanged(segmentLevel, item && item.title);
    onSearchFieldsChange(updateHash);
    updateIsLoading(false, 'segment', segmentLevel);
    updateSearch && runSearch();
  };

  const handleSegmentIconClick = async (segmentLevel) => {
    // An existing industry level was cleared
    if (segmentLevel < SearchFields.segment.length) {
      updateIsLoading(true, 'segment', segmentLevel);
      const updateHash = await SearchFields.segmentSelectionChanged(segmentLevel, null);
      onSearchFieldsChange(updateHash);
      updateIsLoading(false, 'segment', segmentLevel);
      runSearch();
    }
  };

  const removeIndustryNAFromSearchParams = (searchParams) => {
    if (!searchParams.industry) {
      return searchParams;
    }

    const correctedSearchParams = _.cloneDeep(searchParams);
    if (correctedSearchParams.industry[correctedSearchParams.industry.length - 1] === 'N/A') {
      correctedSearchParams.industry.pop();
      correctedSearchParams.excludeSubindustries = true;
    }
    return correctedSearchParams;
  };

  const setSearchToParams = async (allSearchParams, shouldRunSearch = true) => {
    let updateHash;
    if (!allSearchParams.industry) {
      updateHash = await handleIndustryChange(0, null);
      return updateHash;
    }

    const searchParams = removeIndustryNAFromSearchParams(
      _.pick(allSearchParams, SEARCH_PARAM_KEYS),
    );
    const resultFilters = _.pick(allSearchParams, RESULT_FILTER_KEYS);
    const currentSearchParams = removeIndustryNAFromSearchParams(SearchFields.searchParams);
    const currentResultFilters = searchReducer.searchResultFilters;

    let needToSearch = false;
    if (!_.isEqual(searchParams, currentSearchParams)) {
      needToSearch = true;
      updateHash = await handleIndustryChange(0, { path: searchParams.industry }, false);
      searchParams.excludeSubindustries && (await handleExcludeSubindustriesClick(false));
      searchParams.metric && (await handleMetricChange({ title: searchParams.metric }, false));
      if (searchParams.segmentation) {
        for (let i = 0; i < searchParams.segmentation.length; i++) {
          // eslint-disable-next-line no-await-in-loop
          updateHash = await handleSegmentChange(i, { title: searchParams.segmentation[i] }, false);
        }
      }
    }

    const cleanCurrentResultFilters = _.pick(currentResultFilters, RESULT_FILTER_KEYS);
    const finalResultFilters = {};
    if (!_.isEqual(resultFilters, cleanCurrentResultFilters)) {
      needToSearch = true;
      if (!!resultFilters.sortField && !!resultFilters.sortOrder) {
        finalResultFilters.sortField = resultFilters.sortField;
        finalResultFilters.sortOrder = resultFilters.sortOrder;
      }
      if (resultFilters.quickFilter) {
        finalResultFilters.quickFilter = resultFilters.quickFilter;
      }
      if (resultFilters.freeReportsOnly === 'true') {
        finalResultFilters.freeReportsOnly = resultFilters.freeReportsOnly;
      }
      setResultFilters(finalResultFilters);
    }

    needToSearch && shouldRunSearch && runSearch(finalResultFilters, false);

    return updateHash;
  };

  useEffect(() => {
    async function init() {
      let updateHash = await SearchFields.initialize();
      loadTaxonomyTree(pathArrayToTree(SearchFields.industryPaths));
      const initSearchParams = qs.parse(window.location.search.slice(1));
      if (initSearchParams && initSearchParams.industry && initSearchParams.industry.length) {
        updateHash = await setSearchToParams(initSearchParams);
      } else {
        updateHash = await setSearchToParams({ industry: mainIndustrySubscription }, false);
      }
      onSearchFieldsChange(updateHash);
    }

    if (!SearchFields.initialized) {
      init();
    }
  }, []);

  useEffect(() => {
    const backListener = history.listen(async () => {
      if (history.action === 'POP') {
        const searchParams = qs.parse(window.location.search.slice(1));
        const updateHash = await setSearchToParams(searchParams);
        onSearchFieldsChange(updateHash);
      } else if (history.action === 'PUSH') {
        const searchParams = qs.parse(window.location.search.slice(1));
        if (searchParams.src === 'dashboard') {
          const updateHash = await setSearchToParams(searchParams);
          onSearchFieldsChange(updateHash);
        }
      }
      return () => backListener();
    });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <h2 className={classes.searchLabels}>I&apos;m looking for reports about:</h2>
        <SearchSelectGroup
          placeholders={PLACEHOLDERS.INDUSTRY}
          isLoading={isLoading.industry}
          lists={SearchFields.industryDropdowns}
          values={SearchFields.industry}
          onChange={handleIndustryChange}
          onIconClick={handleIndustryIconClick}
        />
        <div className={classes.industryCheckboxContainer}>
          <Checkbox
            label="Exclude Subindustries"
            value={SearchFields.excludeSubindustries}
            onClick={handleExcludeSubindustriesClick}
            type="DANGER"
          />
        </div>
      </div>

      <div className={classes.sectionContainer}>
        <h2 className={classes.searchLabels}>With data measuring:</h2>
        <SearchSelect
          iconType={SearchFields.metric ? SELECT_ICON_TYPES.REMOVE : SELECT_ICON_TYPES.DROPDOWN}
          placeholder={PLACEHOLDERS.METRIC.GENERAL}
          isLoading={isLoading.metric}
          items={SearchFields.metricDropdown}
          value={SearchFields.metric}
          onSelect={(item) => handleMetricChange(item, true)}
          onIconClick={handleMetricIconClick}
        />
      </div>
      <div className={classes.sectionContainer}>
        <h2 className={classes.searchLabels}>Segmented by:</h2>
        <SearchSelectGroup
          placeholders={PLACEHOLDERS.SEGMENT}
          isLoading={isLoading.segment}
          lists={SearchFields.segmentDropdowns}
          values={SearchFields.segment}
          onChange={handleSegmentChange}
          onIconClick={handleSegmentIconClick}
        />
      </div>
      <div className={classes.sectionContainer}>
        <Taxonomy onNodeClick={runSearch} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchReducer: state.search,
  userReducer: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  onSearchFieldsChange: () => dispatch(setFieldsUpdateHash()),
  loadTaxonomyTree: (payload) => dispatch(setExplorerIndustryTree(payload)),
  setResultFilters: (payload) => dispatch(setSearchResultFilters(payload)),
  resetSearchResultFilters: () => dispatch(setSearchResultFilters({})),
  performSearch: (payload) => dispatch(getSearchResults(payload)),
  makeSearchPristine: () => dispatch(setSearchPristine()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(withRouter(SearchSidebar)));

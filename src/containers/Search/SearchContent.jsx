import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import qs from 'qs';
import { Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import _ from 'lodash';
import { COLORS } from '../../utils/theme';
import {
  getSearchResults,
  getSearchResultsNextPage,
  setFieldsUpdateHash,
  setSearchResultFilters,
  setSearchPristine,
} from '../../redux';
import SearchDashboard from './SearchDashboard';
import BigSearchSelect from '../../components/SearchSelect/BigSearchSelect';
import SearchResult from '../../components/SearchResult/SearchResult';
import MessageSearchResult from '../../components/SearchResult/MessageSearchResult';
import ResultFilters from '../../components/ResultFilters/ResultFilters';
import { mapReportToResult } from '../../utils/mappers';
import * as AnalyticsService from '../../utils/analytics';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    minWidth: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: '14px 24px 8px 24px',
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: COLORS.BASIC800,
    margin: '0 20px 0 0',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  clearButton: {
    fontSize: 13,
    position: 'relative',
    top: 14,
    color: COLORS.BASIC600,
    marginLeft: 6,
    marginRight: 16,
    userSelect: 'none',
    cursor: 'pointer',
  },
  resultsFiltersContainer: {
    marginTop: 7,
    marginLeft: 'auto',
    alignSelf: 'center',
  },
  loaderWrapper: {
    position: 'relative',
    height: 0,
  },
  loaderContainer: {
    position: 'absolute',
    background: 'rgba(255,255,255,.8)',
    width: '100%',
    height: 1000,
    display: 'flex',
    paddingTop: 100,
    justifyContent: 'center',
    zIndex: 99999,
  },
  dashboardContainer: {
    padding: '1px 24px 14px 24px',
    overflowX: 'hidden',
    overflowY: 'overlay',
  },
  resultsContainer: {
    padding: '1px 24px 14px 24px',
    overflowX: 'hidden',
    overflowY: 'overlay',
  },
  infiniteScrollIsLoadingContainer: {
    width: '100%',
    height: 0,
    fontSize: 15,
    color: COLORS.BASIC800,
  },
};

const TOO_FEW_RESULTS_THRESHOLD = 2;
const TYPE_TO_SEARCH_DELAY = 120; // milliseconds
let resultsFiltersSearchTimeout = null;

const SearchContent = ({
  classes,
  history,
  apiReducer,
  searchReducer,
  onResultFiltersChange,
  fetchResults,
  fetchResultsNextPage,
  makeSearchPristine,
  onSearchFieldsChange,
  resetSearchResultFilters,
}) => {
  const {
    SearchFields,
    searchResultFilters,
    resultsCount,
    isPristineSearch,
    lastSearchUpdateSource,
  } = searchReducer;
  const searchResults = searchReducer.resultsItems;
  const { industryTitle } = SearchFields;
  const isApiLoading = apiReducer.loading;
  const showNoSearchResultsMessage = !isPristineSearch && !isApiLoading && !searchResults.length;
  const showTooFewResultsMessage =
    !isPristineSearch &&
    !isApiLoading &&
    !!searchResults.length &&
    searchResults.length <= TOO_FEW_RESULTS_THRESHOLD;

  const resultsContainerRef = useRef();
  // TODO: FIX!!!
  // eslint-disable-next-line no-param-reassign
  searchReducer.resultsContainerRef = resultsContainerRef;

  const [lastResultFilterChanged, setLastResultFilterChanged] = useState();

  const updateSearch = (filterValue) => {
    if (resultsContainerRef && resultsContainerRef.current) {
      // eslint-disable-next-line no-param-reassign
      resultsContainerRef.current.scrollTop = 0;
    }
    const { searchParams } = SearchFields;
    const completeSearchParams = {
      ...searchParams,
      ...filterValue,
    };
    const historySearchParams = _.omit(completeSearchParams, ['eventSource', 'quickFilter']);

    history.push(`/search?${qs.stringify(historySearchParams)}`);

    fetchResults({
      ...searchParams,
      ...filterValue,
    });
  };

  const handleResultFiltersChange = (filterValue) => {
    setLastResultFilterChanged(filterValue.eventSource);
    onResultFiltersChange(filterValue);
    if (resultsFiltersSearchTimeout) {
      clearTimeout(resultsFiltersSearchTimeout);
    }
    resultsFiltersSearchTimeout = setTimeout(() => updateSearch(filterValue), TYPE_TO_SEARCH_DELAY);
  };

  const runSearch = async () => {
    const { searchParams } = SearchFields;
    resetSearchResultFilters();
    if (resultsContainerRef && resultsContainerRef.current) {
      resultsContainerRef.current.scrollTop = 0;
    }

    history.push(`/search?${qs.stringify(searchParams)}`);

    fetchResults(searchParams);
  };

  const handleIndustrySelect = async (item) => {
    if (!item) {
      return;
    }
    const updateHash = await SearchFields.industryL0Changed(item);
    onSearchFieldsChange(updateHash);
    runSearch();
  };

  const handleReportClick = (report) =>
    AnalyticsService.trackReportUrlClick(
      report.id,
      report.name,
      report.url,
      SearchFields.searchParams,
    );

  const handleClearClick = () => {
    makeSearchPristine();
    history.push('/search');
  };

  useEffect(() => {
    AnalyticsService.trackVisitSearchPage();
    AnalyticsService.gaTrackPageVisit();
  }, []);

  // TODO: Improve
  const showLoader = lastSearchUpdateSource !== 'quickFilter' && isApiLoading;

  return (
    <div className={classes.container}>
      <Helmet>
        <title>T4 | Search</title>
        <link rel="canonical" href="https://app.t4.ai/search" />
      </Helmet>
      <div className={classes.loaderWrapper}>
        {showLoader && (
          <div className={classes.loaderContainer}>
            <Spin size="large" />
          </div>
        )}
      </div>
      <div className={classes.headerContainer}>
        <BigSearchSelect
          items={SearchFields.industryDropdowns[0]}
          value={isPristineSearch ? '' : industryTitle}
          placeholder="Search for an industry"
          onSelect={handleIndustrySelect}
        />
        {!isPristineSearch && (
          <div className={classes.clearButton} onClick={handleClearClick}>
            [clear]
          </div>
        )}
        <div className={classes.resultsFiltersContainer}>
          {!isPristineSearch && (
            <ResultFilters value={searchResultFilters} onChange={handleResultFiltersChange} />
          )}
        </div>
      </div>
      {isPristineSearch ? (
        <div className={classes.dashboardContainer}>
          <SearchDashboard />
        </div>
      ) : (
        <div className={classes.resultsContainer} ref={resultsContainerRef}>
          <InfiniteScroll
            pageStart={1}
            loadMore={fetchResultsNextPage}
            initialLoad={false}
            hasMore={!isApiLoading && searchResults.length < resultsCount}
            useWindow={false}
            threshold={200}
            loader={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <div className={classes.infiniteScrollIsLoadingContainer} key="isLoading">
                Loading ...
              </div>
            }
          >
            {searchResults.map((result) => (
              <SearchResult
                {...mapReportToResult(result)}
                onClick={() => handleReportClick(result)}
              />
            ))}
          </InfiniteScroll>
          {showNoSearchResultsMessage && (
            <MessageSearchResult
              title="No results match your search"
              message="Try deselecting filters or searching a higher industry level"
            />
          )}
          {showTooFewResultsMessage && (
            <MessageSearchResult
              title="Looking for something else?"
              message="Try deselecting filters or searching a higher industry level"
            />
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  apiReducer: state.api,
  searchReducer: state.search,
});

const mapDispatchToProps = (dispatch) => ({
  onResultFiltersChange: (payload) => dispatch(setSearchResultFilters(payload)),
  resetSearchResultFilters: () => dispatch(setSearchResultFilters({})),
  fetchResults: (payload) => dispatch(getSearchResults(payload)),
  fetchResultsNextPage: () => dispatch(getSearchResultsNextPage()),
  onSearchFieldsChange: () => dispatch(setFieldsUpdateHash()),
  makeSearchPristine: () => dispatch(setSearchPristine()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(withRouter(SearchContent)));

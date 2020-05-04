import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import qs from 'qs';
import _ from 'lodash';
import { COLORS } from '../../utils/theme';
import { getSearchResults, setSearchResultFilters } from '../../redux';
import RecSearch from '../../components/SearchDashboard/RecSearch';
import RecReport from '../../components/SearchDashboard/RecReport';
import { getLastElement } from '../../utils/tools';
import * as AnalyticsService from '../../utils/analytics';

const styles = {
  container: {
    width: '100%',
    maxWidth: 1100,
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    fontSize: 30,
    fontWeight: 700,
    color: COLORS.BASIC800,
    userSelect: 'none',
    marginTop: 24,
    marginBottom: 14,
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 13,
    color: COLORS.BASIC600,
    textTransform: 'uppercase',
    fontWeight: 700,
    marginBottom: 7,
  },
  sectionContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
};

const SEARCH_PARAM_KEYS = ['industry', 'excludeSubindustries', 'metric', 'segmentation'];
const RESULT_FILTER_KEYS = ['sortField', 'sortOrder', 'quickFilter', 'freeReportsOnly'];

const SearchDashboard = ({ classes, history, userReducer, fetchResults, setResultFilters }) => {
  const { dashboard, mainIndustrySubscription } = userReducer;

  const handleSearchClick = (title, allSearchParams) => {
    const searchParams = _.pick(allSearchParams, SEARCH_PARAM_KEYS);
    const resultFilters = _.pick(allSearchParams, RESULT_FILTER_KEYS);

    history.push(`/search?${qs.stringify({ ...allSearchParams, src: 'dashboard' })}`);

    AnalyticsService.trackDashboardSearch(title, allSearchParams);

    setResultFilters(resultFilters);
    fetchResults({
      ...searchParams,
      ...resultFilters,
    });
  };

  const handleReportClick = (reportName, reportUrl) => {
    AnalyticsService.trackDashboardReportClick(reportName, reportUrl);
  };

  useEffect(() => {
    AnalyticsService.trackVisitDashboard();
    AnalyticsService.gaTrackPageVisit();
  }, []);

  const industryName = getLastElement(mainIndustrySubscription);
  const pageTitle = `${industryName} Dashboard`;

  return (
    <div className={classes.container}>
      <Helmet>
        <title>{`T4 | ${pageTitle}`}</title>
        <link rel="canonical" href="https://app.t4.ai/search" />
      </Helmet>
      <h1 className={classes.heading}>{pageTitle}</h1>
      {!!dashboard && !!dashboard.recommendedSearches && (
        <div className={classes.section}>
          <h3 className={classes.sectionHeader}>Recommended Searches</h3>
          <div className={classes.sectionContent}>
            {dashboard.recommendedSearches.map((el) => (
              <RecSearch
                title={el.title}
                searchParams={el.searchParams}
                key={`rec-search-${el.title}`}
                onClick={() => handleSearchClick(el.title, el.searchParams)}
              />
            ))}
          </div>
        </div>
      )}
      {!!dashboard && !!dashboard.recommendedSearches && (
        <div className={classes.section}>
          <h3 className={classes.sectionHeader}>{`Key ${industryName} Reports`}</h3>
          <div className={classes.sectionContent}>
            {dashboard.recommendedReports.map((el) => (
              <a
                key={`rec-report-${el.title}`}
                href={el.url}
                // onClick={() => handleReportUrlClick(ReportId, name, url, ReportBranchId)}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => handleReportClick(el.title, el.url)}
              >
                <RecReport {...el} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  userReducer: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  fetchResults: (payload) => dispatch(getSearchResults(payload)),
  setResultFilters: (payload) => dispatch(setSearchResultFilters(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(withRouter(SearchDashboard)));

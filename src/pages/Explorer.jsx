import React from 'react';
import { withRouter } from 'react-router-dom';
import { Steps } from 'intro.js-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import Tooltip from '@material-ui/core/Tooltip';
import Numeral from 'numeral';
import {
  getExplorerDistinctIndustries,
  setExplorerListsIndustry,
  setExplorerIndustryTree,
  updateProfile,
} from '../redux';
import Header from '../components/Header';
import TreeGraph from '../components/Taxonomy/TreeGraph';
import ExplorerList from '../components/ExplorerList';
import FuzzySearchBar from '../components/FuzzySearchBar';
import LoaderOverlay from '../components/LoaderOverlay';
import TrialUpgradeModal from '../components/TrialUpgradeModal';
// import WelcomeModal from '../components/WelcomeModal';
import { USER_SUBSCRIPTION_STATUSES } from '../utils/constants';
import * as AnalyticsService from '../utils/analytics';
import 'intro.js/introjs.css';
import './css/Explorer.css';

const stepsOptions = {
  showStepNumbers: false,
  showButtons: false,
  exitOnOverlayClick: false,
  exitOnEsc: true,
  showBullets: false,
  keyboardNavigation: false,
  tooltipClass: 'Explorer__Intro__Tooltip',
};

const introJSSteps = [
  {
    element: '.Explorer__Intro__1',
    intro:
      '<b>Welcome to the Industry Explorer!</b><br /><br />Here, you can navigate our taxonomy.<br /><br />Type in a cybersecurity category, such as &apos;firewall&apos;, and click on a result.',
    position: 'left',
  },
  {
    element: '.Explorer__Intro__2',
    intro:
      'This is our industry taxonomy map. Click on a category to see what publishers, metrics, and segmentations it contains.<br /> <br />p.s. You can drag and zoom just like a map!',
    position: 'left',
  },
  {
    element: '.Explorer__Intro__3',
    intro: 'Now for the last step! Press on any item to do a quick search for reports.',
    position: 'left',
  },
];

const TOTAL_TRIAL_LIST_LENGTH = 4;

const blurredPublishersText = ['T4 Is The Best', 'Welcome', 'Contact Us', 'Catalog'];

const blurredMetricsText = ['Market Research', 'To Our', 'Access Our', 'Have A'];

const blurredSegmentationsText = ['Platform', 'Code', 'Entire Massive', 'Nice Day'];

class Explorer extends React.Component {
  constructor(props) {
    super(props);

    const { industryTree, listsIndustry } = props.explorer;

    // Select first item from user's industryEnabled
    if (!Object.keys(industryTree).length) {
      props.getExplorerDistinctIndustries();
    } else {
      props.setExplorerIndustryTree(industryTree);
    }

    this.state = {
      selectedIndustry: listsIndustry,
      showExplorerWalkthrough: props.user.preferences.showExplorerWalkthrough,
      // showWelcomeModal: false,
      showTrialUpgradeModal: false,
      loaderEnabled: true,
    };

    this.autoSelectIndustryOnLoad = false;
    this.backListener = null;

    AnalyticsService.trackVisitExplorerPage();
    AnalyticsService.gaTrackPageVisit();
  }

  componentDidMount = () => {
    // Temporary fix for reduce map renders
    this.mapRedrawCount = 0;

    this.autoSelectIndustryOnLoad = this.extractPathFromLocation();

    if (this.searchBarRef) {
      this.searchBarRef.getInputRef().focus();
    }

    this.backListener = this.props.history.listen(() => {
      if (this.props.history.action === 'POP') {
        this.autoSelectIndustryOnLoad = this.extractPathFromLocation();
        this.setState({ loaderEnabled: false });
      }
    });
  };

  componentWillUnmount() {
    this.backListener();
  }

  extractPathFromLocation = () => {
    const { path } = this.props.match.params;
    return path ? decodeURIComponent(path).split(',') : null;
  };

  handleSearchBarItemClick = (item) => {
    this.props.history.push(`/explorer/${encodeURIComponent(item.path)}`);

    if (this.TreeGraphRef) {
      this.TreeGraphRef.panAndZoomToNode(item.path, true, () =>
        this.selectNewTreeNode(item.path, false),
      );
    }

    if (this.state.showExplorerWalkthrough && this.StepsRef) {
      this.StepsRef.introJs.nextStep();
      if (this.searchBarRef) {
        this.searchBarRef.getInputRef().blur();
      }
    }

    AnalyticsService.trackExplorerIndustrySearch(item.path);
    this.setState({ loaderEnabled: false });
  };

  // handleWelcomeModalClick = () => {
  //   this.setState({ showWelcomeModal: false });
  // };

  handleExplorerListCTAClick = () => {
    AnalyticsService.trackCTAExplorerListClick();
    this.setState({ showTrialUpgradeModal: true });
  };

  handleNodeClick = (nodePath) => {
    AnalyticsService.trackExplorerNodeClick(nodePath);

    this.props.history.push(`/explorer/${encodeURIComponent(nodePath)}`);

    if (this.state.showExplorerWalkthrough && this.StepsRef) {
      this.StepsRef.introJs.nextStep();
      this.props.updateProfile({
        preferences: {
          showExplorerWalkthrough: false,
        },
      });

      AnalyticsService.trackCompleteWalkthroughEvent();
    }
    this.selectNewTreeNode(nodePath);
  };

  selectNewTreeNode = (nodePath, showLoader = true) => {
    this.props.setExplorerListsIndustry(nodePath);
    this.mapRedrawCount++;

    const tree = this.props.explorer.industryTree;
    const { selectedIndustry } = this.state;
    let currentNode = tree;

    // Set old selection to false
    if (selectedIndustry.length) {
      for (let i = 1; i < selectedIndustry.length; i++) {
        for (let j = 0; j < currentNode.children.length; j++) {
          const childNode = currentNode.children[j];
          if (childNode.name === selectedIndustry[i]) {
            currentNode = childNode;
            break;
          }
        }
      }
    }
    currentNode.selected = false;

    // Set new selection to true
    currentNode = tree;
    for (let i = 1; i < nodePath.length; i++) {
      for (let j = 0; j < currentNode.children.length; j++) {
        const childNode = currentNode.children[j];
        if (childNode.name === nodePath[i]) {
          currentNode = childNode;
          break;
        }
      }
    }
    currentNode.selected = true;

    this.setState({
      selectedIndustry: nodePath,
      loaderEnabled: showLoader,
    });
  };

  renderStatsSection = () => {
    const { listsIndustry, loadedIndustry, industryStatistics } = this.props.explorer;
    const displayIndustry = loadedIndustry.length ? loadedIndustry : listsIndustry;

    let statsString = '';
    let marketShareStr = '';
    let marketShareSourceStr = '';
    let showStats = false;
    if (industryStatistics.length) {
      const industryTitle = displayIndustry[displayIndustry.length - 1];
      const industrySize = industryStatistics.find((el) => el.name === 'Industry Size');
      const industryGrowth = industryStatistics.find((el) => el.name === 'Industry Growth');
      const marketShare = industryStatistics.find((el) => el.name === 'Market Share');

      const statsStringArray = [];
      if (industrySize)
        statsStringArray.push(
          Numeral(industrySize.value * 10 ** 9)
            .format('($0[.]0a)')
            .toUpperCase(),
        );
      if (industryGrowth) statsStringArray.push(`${Math.round(industryGrowth.value * 100)}% YoY`);

      if (marketShare) {
        marketShareStr = `Market Share: `;
        marketShareStr += marketShare.value
          .map((el) => `${el.name} (${Math.round(el.share * 100)}%)`)
          .join(', ');

        marketShareSourceStr = `Main Source: ${marketShare.source}, ${marketShare.baseYear}.`;
      }

      showStats = !!statsStringArray.length || !!marketShareStr;
      statsString = `${industryTitle} (${statsStringArray.join(', ')})`;
    }

    if (!showStats) return null;

    return (
      <div className="Explorer__Stats-Section">
        <h3>{statsString}</h3>
        &nbsp;
        {marketShareStr && (
          <span>
            {marketShareStr}
            .&nbsp;
            <i>{marketShareSourceStr}</i>
          </span>
        )}
      </div>
    );
  };

  render() {
    const { showExplorerWalkthrough, showTrialUpgradeModal, loaderEnabled } = this.state;
    const { api, user, explorer } = this.props;
    const isTrialSubscription = user.subscription.status === USER_SUBSCRIPTION_STATUSES.TRIAL;
    const {
      industryTree,
      industrySearchItems,
      listsIndustry,
      industryPublishers,
      industryMetrics,
      industrySegmentations,
    } = explorer;
    const appendCTAtoLists = isTrialSubscription && !!listsIndustry.length;

    if (this.autoSelectIndustryOnLoad && this.TreeGraphRef) {
      if (this.TreeGraphRef.isReady()) {
        const pathCopy = [...this.autoSelectIndustryOnLoad];
        this.TreeGraphRef.panAndZoomToNode(pathCopy, true, () =>
          this.selectNewTreeNode(pathCopy, false),
        );
        this.autoSelectIndustryOnLoad = null;
      }
    }

    return (
      <div className="Explorer">
        <Helmet>
          <title>T4 | Industry Explorer</title>
          <link rel="canonical" href="https://app.t4.ai/explorer" />
        </Helmet>
        <LoaderOverlay show={loaderEnabled && api.loading} />
        {/* {showWelcomeModal && (
          <WelcomeModal show={showWelcomeModal} onButtonClick={this.handleWelcomeModalClick} />
        )} */}
        {showExplorerWalkthrough && (
          <Steps
            enabled={showExplorerWalkthrough}
            steps={introJSSteps}
            initialStep={0}
            options={stepsOptions}
            onExit={() => {}}
            ref={(ref) => {
              this.StepsRef = ref;
            }}
          />
        )}
        <TrialUpgradeModal
          show={showTrialUpgradeModal}
          handleOutsideClick={() => this.setState({ showTrialUpgradeModal: false })}
        />
        <Header />
        <div className="Explorer__Area">
          <div className="spacer--v--10" />
          <h1>Industry Explorer</h1>
          <div className="Explorer__Select Explorer__Intro__1">
            <FuzzySearchBar
              items={industrySearchItems}
              minSearchLength={2}
              infoKey="info"
              placeholder="Search for an industry"
              onItemClick={this.handleSearchBarItemClick}
              resultsSortFunction={(a, b) => a.path.length - b.path.length}
              ref={(node) => {
                this.searchBarRef = node;
              }}
            />
          </div>
          <div className="spacer--v--20" />
          <div className="Explorer__TreeGraph-Container Explorer__Intro__2">
            <TreeGraph
              dataTree={industryTree}
              nodeSize={[500, 26]}
              onNodeClick={this.handleNodeClick}
              redrawCount={this.mapRedrawCount}
              ref={(ref) => {
                this.TreeGraphRef = ref;
              }}
            />
          </div>
          <div className="spacer--v--30" />
          {!showExplorerWalkthrough && this.renderStatsSection()}
          <div className="Explorer__List-Section Explorer__Intro__3">
            <div className="Explorer__List-Container">
              <h2>Publishers</h2>
              {appendCTAtoLists ? (
                <Tooltip
                  title="Searching by Publisher is disabled in the free trial."
                  placement="top"
                  classes={{
                    tooltip: 'Explorer__List__Tooltip',
                    popper: 'Explorer__List__Popper',
                  }}
                >
                  <div className="ExplorerList">
                    <ExplorerList
                      param="qfilter"
                      list={industryPublishers}
                      appendSalesSection={appendCTAtoLists}
                      blurredSalesText={blurredPublishersText.slice(
                        0,
                        TOTAL_TRIAL_LIST_LENGTH - industryPublishers.length,
                      )}
                      handleTrialCTAClick={this.handleExplorerListCTAClick}
                      isDuringWalkthrough={showExplorerWalkthrough}
                    />
                  </div>
                </Tooltip>
              ) : (
                <ExplorerList
                  param="qfilter"
                  list={industryPublishers}
                  appendSalesSection={appendCTAtoLists}
                  blurredSalesText={blurredPublishersText.slice(
                    0,
                    TOTAL_TRIAL_LIST_LENGTH - industryPublishers.length,
                  )}
                  handleTrialCTAClick={this.handleExplorerListCTAClick}
                  isDuringWalkthrough={showExplorerWalkthrough}
                />
              )}
            </div>
            <div className="Explorer__List-Container">
              <h2>Data Metrics</h2>
              <ExplorerList
                param="metric"
                list={industryMetrics}
                appendSalesSection={appendCTAtoLists}
                blurredSalesText={blurredMetricsText.slice(
                  0,
                  TOTAL_TRIAL_LIST_LENGTH - industryMetrics.length,
                )}
                handleTrialCTAClick={this.handleExplorerListCTAClick}
                isDuringWalkthrough={showExplorerWalkthrough}
              />
            </div>
            <div className="Explorer__List-Container">
              <h2>Segmentations</h2>
              <ExplorerList
                param="segmentation"
                list={industrySegmentations}
                appendSalesSection={appendCTAtoLists}
                blurredSalesText={blurredSegmentationsText.slice(
                  0,
                  TOTAL_TRIAL_LIST_LENGTH - industrySegmentations.length,
                )}
                handleTrialCTAClick={this.handleExplorerListCTAClick}
                isDuringWalkthrough={showExplorerWalkthrough}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(
  (state) => ({
    api: state.api,
    explorer: state.explorer,
    user: state.user,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        getExplorerDistinctIndustries,
        setExplorerIndustryTree,
        setExplorerListsIndustry,
        updateProfile,
      },
      dispatch,
    ),
)(withRouter(Explorer));

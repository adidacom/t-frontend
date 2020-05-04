import React, { useRef, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import _ from 'lodash';
import { COLORS } from '../../utils/theme';
import { getSearchResults, setFieldsUpdateHash } from '../../redux';
import ExpandIcon from './ExpandIcon';
import TreeGraph from './TreeGraph';
import { sleep } from '../../utils/tools';
import * as AnalyticsService from '../../utils/analytics';

const FULL_SCREEN_MARGINS = [40, 40];
const BACKDROP_TRANSITION_TIME = 200;

const styles = {
  container: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#ffffffb0',
  },
  content: {
    position: 'fixed',
    left: 24,
    bottom: 24,
    width: 375,
    height: 220,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 4,
    background: COLORS.BASIC100,
    boxShadow: '0 2px 10px 2px rgba( 0, 0, 0, 0.15)',
    transition: 'all 0.4s ease-in-out',
    overflow: 'hidden',
    zIndex: 100,
  },
  expandedContent: {
    position: 'fixed',
    left: FULL_SCREEN_MARGINS[0],
    bottom: FULL_SCREEN_MARGINS[1],
    width: `calc(100vw - ${2 * FULL_SCREEN_MARGINS[0]}px)`,
    height: `calc(100vh - ${2 * FULL_SCREEN_MARGINS[1]}px)`,
  },
  animationEnter: {
    opacity: 0,
  },
  animationEnterActive: {
    opacity: 1,
    transition: `all ${BACKDROP_TRANSITION_TIME}ms`,
    transitionTimingFunction: 'cubic-bezier(0.65, 0.05, 0.36, 1)',
  },
  animationExit: {
    opacity: 1,
  },
  animationExitActive: {
    opacity: 0,
    transition: `all ${BACKDROP_TRANSITION_TIME}ms`,
    transitionTimingFunction: 'cubic-bezier(0.65, 0.05, 0.36, 1)',
  },
};

const INITIAL_TAXONOMY_NODE = ['Technology'];

const Taxonomy = ({
  classes,
  explorerReducer,
  searchReducer,
  onSearchFieldsChange,
  onNodeClick,
}) => {
  const { industryTree } = explorerReducer;
  const { SearchFields } = searchReducer;

  const [isExpanded, setIsExpanded] = useState(false);
  const [mapRedrawCount, setMapRedrawCount] = useState(0);
  const [lastSearchIndustryPath, setLastSearchIndustryPath] = useState([]);
  const treeGraphRef = useRef();

  const searchIndustryPath = SearchFields.industry;
  if (treeGraphRef && treeGraphRef.current && SearchFields.initialized) {
    if (!lastSearchIndustryPath.length) {
      setLastSearchIndustryPath(INITIAL_TAXONOMY_NODE);
    } else if (
      searchIndustryPath.length &&
      !_.isEqual(searchIndustryPath, lastSearchIndustryPath) &&
      !_.isEqual(searchIndustryPath, INITIAL_TAXONOMY_NODE)
    ) {
      setLastSearchIndustryPath(searchIndustryPath);
      treeGraphRef.current.panAndZoomToNode(searchIndustryPath);
    }
  }

  const handleExpandIconClick = () => {
    setIsExpanded(!isExpanded);
    setMapRedrawCount(mapRedrawCount + 1);
  };

  const handleTreeNodeClick = async (nodePath) => {
    if (_.isEqual(nodePath, lastSearchIndustryPath)) {
      return;
    }

    AnalyticsService.trackExplorerNodeClick(nodePath);

    const needsToRecenter = isExpanded;
    if (isExpanded) {
      setIsExpanded(false);
    }

    const updateHash = await SearchFields.industryPathChanged({ path: nodePath });
    setLastSearchIndustryPath(nodePath);
    onSearchFieldsChange(updateHash);
    setMapRedrawCount(mapRedrawCount + 1);
    onNodeClick && onNodeClick();

    if (needsToRecenter && treeGraphRef && treeGraphRef.current && SearchFields.initialized) {
      await sleep(300);
      treeGraphRef.current.panAndZoomToNode(nodePath, false);
    }
  };

  return (
    <div className={classes.container}>
      <div
        className={classnames(classes.content, isExpanded && classes.expandedContent)}
        onTransitionEnd={() => setMapRedrawCount(mapRedrawCount + 1)}
      >
        <CSSTransition
          in={isExpanded}
          timeout={BACKDROP_TRANSITION_TIME}
          classNames={{
            enter: classes.animationEnter,
            enterActive: classes.animationEnterActive,
            exit: classes.animationExit,
            exitActive: classes.animationExitActive,
          }}
          unmountOnExit
        >
          <div className={classes.backdrop} />
        </CSSTransition>
        <ExpandIcon isExpanded={isExpanded} onClick={handleExpandIconClick} />
        <TreeGraph
          dataTree={industryTree}
          nodeSize={[520, 30]}
          isExpanded={isExpanded}
          redrawCount={mapRedrawCount}
          onNodeClick={handleTreeNodeClick}
          ref={treeGraphRef}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  explorerReducer: state.explorer,
  searchReducer: state.search,
});

const mapDispatchToProps = (dispatch) => ({
  onSearchFieldsChange: () => dispatch(setFieldsUpdateHash()),
  performSearch: (payload) => dispatch(getSearchResults(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Taxonomy));

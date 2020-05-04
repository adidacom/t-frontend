import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { LinkHorizontal } from '@vx/shape';
import { hierarchy, tree as d3tree } from 'd3-hierarchy';
import { ReactSVGPanZoom, TOOL_AUTO } from 'react-svg-pan-zoom';
import BezierEasing from 'bezier-easing';
import TreeNode from './TreeNode';
import { COLORS } from '../../utils/theme';

const ANIMATION_SETTINGS = {
  animationTime: 540,
  animationStepTime: 14,
  easingFunction: BezierEasing(0, 0, 0.3, 1),
  zoomModLevel: 0.7,
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    borderRadius: 4,
    overflow: 'hidden',
  },
  treeLink: {
    stroke: `${COLORS.BASIC500}59`,
    strokeWidth: 2,
    fill: 'none',
  },
};

class TreeGraph extends React.Component {
  constructor(props) {
    super(props);
    // firstLoad is to fix component not updating and resizing with prop during initial mount
    this.firstLoad = true;
    this.currentlyAnimating = false;
  }

  // TODO: Make fix map re-render issue
  shouldComponentUpdate(nextProps) {
    const { redrawCount } = this.props;
    return !Object.keys(this.props.dataTree).length || nextProps.redrawCount !== redrawCount;
  }

  componentDidUpdate(prevProps) {
    if (
      this.panZoomViewerRef &&
      (this.props.dataTree.name !== prevProps.dataTree.name || this.firstLoad)
    ) {
      this.firstLoad = false;
    }
  }

  componentWillUnmount() {
    // Clear timing interval if active
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  isReady = () => !!this.treeAndCoordinates.treeStructure.children;

  isAnimating = () => this.currentlyAnimating;

  setPanAndZoom = (x, y, zoom) => {
    const { panZoomViewerRef } = this;
    if (panZoomViewerRef) {
      panZoomViewerRef.setPointOnViewerCenter(x, y, zoom);
    }
  };

  panAndZoomToNode = (path, animate = true, onAnimationComplete = null) => {
    // Find node through path
    let node = this.treeAndCoordinates.treeStructure;
    for (let i = 1; i < path.length; i++) {
      node = node.children.find((item) => item.data.name === path[i]);
    }

    const { svgTopOffset, svgLeftOffset } = this.treeAndCoordinates;

    const finalCords = {
      x: node.y + svgLeftOffset,
      y: node.x + svgTopOffset,
      zoom: 0.9,
    };

    if (animate) {
      this.animateToCoordinates(finalCords.x, finalCords.y, finalCords.zoom, onAnimationComplete);
    } else {
      this.setPanAndZoom(finalCords.x, finalCords.y, finalCords.zoom);
    }
  };

  animateToCoordinates = (x, y, zoom, onAnimationComplete) => {
    if (!this.panZoomViewerRef) return;

    this.currentlyAnimating = true;
    const pzvVal = this.panZoomViewerRef.getValue();
    const { viewerWidth, viewerHeight } = pzvVal;
    const translationX = pzvVal.e;
    const translationY = pzvVal.f;
    const scaleFactor = pzvVal.a;
    const initCords = {
      x: (0 - translationX + viewerWidth / 2) / scaleFactor,
      y: (0 - translationY + viewerHeight / 2) / scaleFactor,
      zoom: scaleFactor,
    };

    const { animationTime, animationStepTime, easingFunction, zoomModLevel } = ANIMATION_SETTINGS;
    const animationSteps = animationTime / animationStepTime;
    let animationStep = 0;
    const stepX = (x - initCords.x) / animationSteps;
    const stepY = (y - initCords.y) / animationSteps;
    const stepZoom = (zoom - initCords.zoom) / animationSteps;
    const animationTimingInterval = setInterval(() => {
      if (animationStep++ < animationSteps - 1) {
        const easeValue = easingFunction(animationStep / animationSteps);
        const zoomModValue = zoomModLevel * (1 - animationStep / animationSteps);
        this.setPanAndZoom(
          initCords.x + animationSteps * stepX * easeValue,
          initCords.y + animationSteps * stepY * easeValue,
          initCords.zoom + animationSteps * stepZoom * easeValue - zoomModValue * easeValue,
        );
      } else {
        clearInterval(animationTimingInterval);
        this.setPanAndZoom(x, y, zoom);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        this.currentlyAnimating = false;
      }
    }, animationStepTime);
  };

  generateTreeAndCoordinates = () => {
    const { dataTree, nodeSize, padding } = this.props;

    const generateTree = d3tree();
    // Transpose x and y dimensions
    generateTree.nodeSize([nodeSize[1], nodeSize[0]]);
    let treeStructure = generateTree(hierarchy(dataTree));

    let xMin = 0;
    let xMax = 0;
    let yMin = 0;
    let yMax = 0;
    const treeDescendants = treeStructure.descendants();
    for (let i = 0; i < treeDescendants.length; i++) {
      // NOTE: x and y are transposed
      const curNode = treeDescendants[i];
      xMin = Math.min(xMin, curNode.y);
      xMax = Math.max(xMax, curNode.y);
      yMin = Math.min(yMin, curNode.x);
      yMax = Math.max(yMax, curNode.x);
    }

    let svgWidth = xMax - xMin + padding.left + padding.right;
    let svgHeight = yMax - yMin + padding.top + padding.bottom;

    let enclosingWidth = 0;
    let enclosingHeight = 0;
    if (this.containerRef) {
      const enclosingRect = this.containerRef.parentNode.getBoundingClientRect();
      enclosingWidth = enclosingRect.width;
      enclosingHeight = enclosingRect.height;
    }

    // Check to see it tree needs to be scaled up to fit enclosing div
    // NOTE: x and y are transposed
    const newTreeSize = [yMax - yMin, xMax - xMin];
    let needsRedrawFlag = false;
    if (svgWidth < enclosingWidth) {
      needsRedrawFlag = true;
      newTreeSize[1] = enclosingWidth - padding.left - padding.right;
      svgWidth = enclosingWidth;
    }
    if (svgHeight < enclosingHeight) {
      needsRedrawFlag = true;
      newTreeSize[0] = enclosingHeight - padding.top - padding.bottom;
      svgHeight = enclosingHeight;
    }
    if (needsRedrawFlag) {
      generateTree.size(newTreeSize);
      treeStructure = generateTree(hierarchy(dataTree));
      yMin = 0;
    }

    this.treeAndCoordinates = {
      enclosingWidth,
      enclosingHeight,
      svgWidth,
      svgHeight,
      svgTopOffset: padding.top - yMin,
      svgLeftOffset: padding.left,
      treeStructure,
    };
  };

  render() {
    this.generateTreeAndCoordinates();

    const { classes, onNodeClick, isExpanded } = this.props;
    const {
      enclosingWidth,
      enclosingHeight,
      svgTopOffset,
      svgLeftOffset,
      treeStructure,
    } = this.treeAndCoordinates;

    if (!treeStructure) return null;

    return (
      <div
        className={classes.container}
        ref={(n) => {
          this.containerRef = n;
        }}
      >
        <ReactSVGPanZoom
          width={isExpanded ? 5000 : enclosingWidth}
          height={isExpanded ? 5000 : enclosingHeight}
          tool={TOOL_AUTO}
          background="none"
          SVGBackground="none"
          toolbarPosition="none"
          miniaturePosition="none"
          detectAutoPan={false}
          scaleFactorMin={0.05}
          scaleFactorMax={2}
          ref={(n) => {
            this.panZoomViewerRef = n;
          }}
        >
          {/* eslint-disable react/no-array-index-key */}
          <svg width="100vw" height="100vh">
            <Group top={svgTopOffset} left={svgLeftOffset}>
              {treeStructure.links().map((link, i) => (
                <LinkHorizontal key={`link-${i}`} data={link} className={classes.treeLink} />
              ))}
              {treeStructure.descendants().map((node, i) => (
                <TreeNode
                  key={`node-${i}`}
                  node={node}
                  onClick={() => onNodeClick && onNodeClick(node.data.path)}
                />
              ))}
            </Group>
          </svg>
        </ReactSVGPanZoom>
      </div>
    );
  }
}

TreeGraph.propTypes = {
  nodeSize: PropTypes.arrayOf(PropTypes.number),
  padding: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
  }),
};

TreeGraph.defaultProps = {
  nodeSize: [500, 26],
  padding: {
    top: 40,
    left: 160,
    right: 200,
    bottom: 40,
  },
};

export default withStyles(styles)(TreeGraph);

import React from 'react';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { Group } from '@vx/group';
import { COLORS } from '../../utils/theme';

const styles = {
  container: {
    fontSize: 17,
    fontWeight: 700,
    fill: COLORS.PRIMARY500, // SVG uses fill instead of color for font text
    textAnchor: 'middle',
    userSelect: 'none',
    cursor: 'pointer',
    transition: 'all .12s ease-out',
    '&:hover': {
      fontSize: 22,
    },
  },
  selected: {
    fontSize: 22,
    '&:hover': {
      fontSize: 22,
    },
  },
};

const TreeNode = ({ classes, node, onClick }) => {
  const isSelected = node.data.selected;
  const className = classNames(classes.container, isSelected && classes.selected);
  const nodeText = node.data.name ? node.data.name.toUpperCase() : '';

  return (
    <Group top={node.x} left={node.y} className={className} onClick={onClick}>
      <text dy=".33em">{nodeText}</text>
    </Group>
  );
};

export default withStyles(styles)(TreeNode);

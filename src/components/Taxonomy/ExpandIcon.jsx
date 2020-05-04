import React from 'react';
import { withStyles } from '@material-ui/styles';
import { COLORS } from '../../utils/theme';
import ExpandSVG from '../../assets/svg/expand_corner.svg';
import CollapseSVG from '../../assets/svg/collapse_corner.svg';

const styles = {
  container: {
    position: 'absolute',
    zIndex: 100,
    top: 8,
    right: 8,
    display: 'flex',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 4,
    background: COLORS.WARNING500,
    cursor: 'pointer',
  },
};

const ExpandIcon = ({ classes, isExpanded, ...props }) => {
  const iconImgSrc = isExpanded ? CollapseSVG : ExpandSVG;
  const altText = isExpanded ? 'Collapse' : 'Expand';

  return (
    <div className={classes.container} {...props}>
      <img
        src={iconImgSrc}
        alt={altText}
        style={{
          width: styles.container.width / 2,
        }}
      />
    </div>
  );
};

export default withStyles(styles)(ExpandIcon);

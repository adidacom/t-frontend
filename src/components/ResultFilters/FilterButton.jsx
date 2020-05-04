import React from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { COLORS } from '../../utils/theme';
import SortArrowsBasic600SVG from '../../assets/svg/sort_arrows_basic600.svg';
import SortArrowDownPrimarySVG from '../../assets/svg/sort_arrow_down_primary.svg';
import SortArrowDownBasic600SVG from '../../assets/svg/sort_arrow_down_basic600.svg';

const styles = {
  container: {
    display: 'flex',
    height: 32,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    transition: 'all .12s ease-out',
    userSelect: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    border: `1px ${COLORS.BASIC400} solid`,
    color: COLORS.BASIC600,
    backgroundColor: COLORS.BASIC200,
    '&:hover': {
      border: `1px ${COLORS.PRIMARY} solid`,
      color: COLORS.PRIMARY,
      backgroundColor: COLORS.BASIC100,
    },
    '&:active': {
      border: `1px ${COLORS.PRIMARY} solid`,
      color: COLORS.PRIMARY,
      backgroundColor: COLORS.PRIMARY300,
    },
  },
  content: {
    margin: 'auto 10px auto 14px',
  },
  filterActive: {
    border: `1px ${COLORS.PRIMARY} solid`,
    color: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY200,
    '&:hover': {
      backgroundColor: COLORS.PRIMARY200,
    },
    '&:active': {
      backgroundColor: COLORS.PRIMARY300,
    },
  },
  icon: {
    width: 16,
    height: 16,
    marginLeft: 6,
    position: 'relative',
    bottom: 2,
    transition: 'all .12s ease-out',
  },
  upIcon: {
    transform: 'rotate(180deg)',
  },
};

const isUpIcon = (value) => value === 1;
const isActive = (value) => value !== 0;
const getIconSVG = (value) => {
  if (value === 0) {
    return SortArrowsBasic600SVG;
  }
  return isActive(value) ? SortArrowDownPrimarySVG : SortArrowDownBasic600SVG;
};

const FilterButton = ({ classes, className, label, value = 0, onClick }) => (
  <div
    className={classnames(classes.container, isActive(value) && classes.filterActive, className)}
    onClick={onClick}
  >
    <div className={classes.content}>
      {label}
      <img
        className={classnames(classes.icon, isUpIcon(value) && classes.upIcon)}
        src={getIconSVG(value)}
        alt="Sort"
      />
    </div>
  </div>
);

export default withStyles(styles)(FilterButton);

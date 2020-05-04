import React from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { COLORS } from '../../utils/theme';

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
};

const FilterButton = ({ classes, className, label, value = false, onClick }) => (
  <div
    className={classnames(classes.container, value && classes.filterActive, className)}
    onClick={onClick}
  >
    <div className={classes.content}>{label}</div>
  </div>
);

export default withStyles(styles)(FilterButton);

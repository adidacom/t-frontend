import React from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { COLORS } from '../../utils/theme';
import DropdownSVG from '../../assets/svg/dropdown_danger500.svg';

const styles = {
  container: {
    minWidth: 175,
    display: 'inline-flex',
    padding: '6px 0 6px 6px',
    justifyContent: 'center',
    border: `1px ${COLORS.DANGER500} solid`,
    borderRadius: 4,
    background: COLORS.DANGER100,
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.DANGER500,
    textTransform: 'uppercase',
    transition: 'all .12s ease-out',
    cursor: 'pointer',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: COLORS.BASIC100,
    },
  },
  icon: {
    width: 10,
    marginLeft: 6,
    position: 'relative',
    // bottom: 1,
  },
  upIcon: {
    transform: 'rotate(180deg)',
  },
};

const ExpandDatasetsButton = ({ classes, className, label, arrowUp, onClick }) => (
  <div className={classnames(classes.container, className)} onClick={onClick}>
    {label}
    <img
      className={classnames(classes.icon, arrowUp && classes.upIcon)}
      src={DropdownSVG}
      alt="See more datasets"
    />
  </div>
);

export default withStyles(styles)(ExpandDatasetsButton);

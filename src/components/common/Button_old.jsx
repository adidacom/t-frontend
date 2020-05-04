import React from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { COLORS } from '../../utils/theme';

const styles = {
  container: {
    display: 'inline-flex',
    padding: '8px 16px',
    justifyContent: 'center',
    border: `1px ${COLORS.INFO700} solid`,
    borderRadius: 4,
    background: COLORS.INFO100,
    fontSize: 13,
    fontWeight: 700,
    color: COLORS.INFO700,
    textTransform: 'uppercase',
    transition: 'all .12s ease-out',
    cursor: 'pointer',
    userSelect: 'none',
    '&:hover': {
      background: COLORS.BASIC100,
    },
    '&:active': {
      background: COLORS.INFO500,
    },
  },
  disabled: {
    background: COLORS.BASIC300,
    border: `1px ${COLORS.BASIC400} solid`,
    color: COLORS.BASIC600,
    '&:hover': {
      background: COLORS.BASIC300,
    },
    '&:active': {
      background: COLORS.BASIC300,
    },
    cursor: 'not-allowed',
  },
};

const Button = ({ classes, label, disabled = false, onClick }) => (
  <div className={classnames(classes.container, disabled && classes.disabled)} onClick={onClick}>
    {label}
  </div>
);

export default withStyles(styles)(Button);

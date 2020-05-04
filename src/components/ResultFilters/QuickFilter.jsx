import React from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { COLORS } from '../../utils/theme';
import SearchSVGPrimary400 from '../../assets/svg/search_primary400.svg';
import SearchSVGPrimary from '../../assets/svg/search_primary.svg';

const QUICK_FILTER_MAX_LENGTH = 50;

const styles = {
  container: {
    position: 'relative',
    width: 270,
    height: 32,
  },
  input: {
    width: '100%',
    height: '100%',
    paddingLeft: 16,
    paddingRight: 40,
    background: COLORS.BASIC200,
    border: `1px ${COLORS.BASIC400} solid`,
    borderRadius: 4,
    fontSize: '15px',
    fontWeight: 500,
    color: COLORS.BASIC800,
    transition: 'border .12s ease-out',
    '&:hover': {
      background: COLORS.BASIC300,
    },
    '&:focus': {
      background: COLORS.BASIC100,
      border: `1px ${COLORS.PRIMARY} solid`,
      outline: 'none',
    },
    '&::placeholder': {
      fontWeight: 400,
      color: COLORS.BASIC600,
    },
  },
  iconContainer: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    background: COLORS.PRIMARY100,
    borderRadius: 4,
    border: `1px ${COLORS.PRIMARY300} solid`,
    transition: 'border .12s ease-out',
  },
  icon: {
    width: 16,
    height: 16,
    margin: 'auto',
    userSelect: 'none',
  },
  filterActiveInput: {
    background: COLORS.BASIC100,
    border: `1px ${COLORS.PRIMARY} solid`,
  },
  filterActiveIconContainer: {
    background: COLORS.PRIMARY100,
    border: `1px ${COLORS.PRIMARY500} solid`,
  },
};

const getIconSVG = (value) => (value ? SearchSVGPrimary : SearchSVGPrimary400);

const QuickFilter = ({ classes, value, placeholder, onChange, onFocus, onBlur, onKeyDown }) => (
  <div className={classes.container}>
    <input
      type="text"
      className={classnames(classes.input, value && classes.filterActiveInput)}
      autoComplete="false"
      placeholder={placeholder}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
      maxLength={QUICK_FILTER_MAX_LENGTH}
    />
    <div className={classnames(classes.iconContainer, value && classes.filterActiveIconContainer)}>
      <img className={classes.icon} src={getIconSVG(value)} alt="Quick Filter" />
    </div>
  </div>
);

export default withStyles(styles)(QuickFilter);

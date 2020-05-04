import React, { useState } from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { COLORS, THEME_TYPES } from '../../utils/theme';
import CheckmarkSVG from '../../assets/svg/checkmark_for_box.svg';

const BACKGROUND_OPACITY_HEX = '28';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  checkbox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    borderRadius: 3,
    border: `1px ${COLORS.BASIC500} solid`,
    background: COLORS.BASIC200,
    cursor: 'pointer',
    transition: 'box-shadow .18s ease-out, background .18s ease-out',
    '&:hover': {
      boxShadow: `0 0 0 7px ${COLORS.BASIC200}`,
    },
  },
  checkboxFocused: {
    boxShadow: `0 0 0 7px ${COLORS.BASIC300}`,
  },
  hiddenCheckboxInput: {
    width: 0,
    height: 0,
    zIndex: -100,
    opacity: 0,
    position: 'absolute',
  },
  checkmark: {
    width: 8,
    height: 8,
  },
  label: {
    fontSize: 13,
    color: COLORS.BASIC800,
    marginLeft: 10,
    userSelect: 'none',
    cursor: 'pointer',
  },
  [THEME_TYPES.PRIMARY]: {
    '&:hover': {
      borderColor: COLORS.PRIMARY,
      background: `${COLORS.PRIMARY}${BACKGROUND_OPACITY_HEX}`,
    },
  },
  [THEME_TYPES.SUCCESS]: {
    '&:hover': {
      borderColor: COLORS.SUCCESS,
      background: `${COLORS.SUCCESS}${BACKGROUND_OPACITY_HEX}`,
    },
  },
  [THEME_TYPES.INFO]: {
    '&:hover': {
      borderColor: COLORS.INFO,
      background: `${COLORS.INFO}${BACKGROUND_OPACITY_HEX}`,
    },
  },
  [THEME_TYPES.WARNING]: {
    '&:hover': {
      borderColor: COLORS.WARNING,
      background: `${COLORS.WARNING}${BACKGROUND_OPACITY_HEX}`,
    },
  },
  [THEME_TYPES.DANGER]: {
    '&:hover': {
      borderColor: COLORS.DANGER,
      background: `${COLORS.DANGER}${BACKGROUND_OPACITY_HEX}`,
    },
  },
};

const getCheckboxStyle = (value, type) => {
  if (!value) {
    return {};
  }

  switch (type) {
    case THEME_TYPES.PRIMARY:
      return {
        borderColor: COLORS.PRIMARY,
        background: COLORS.PRIMARY,
      };
    case THEME_TYPES.SUCCESS:
      return {
        borderColor: COLORS.SUCCESS,
        background: COLORS.SUCCESS,
      };
    case THEME_TYPES.INFO:
      return {
        borderColor: COLORS.INFO,
        background: COLORS.INFO,
      };
    case THEME_TYPES.WARNING:
      return {
        borderColor: COLORS.WARNING,
        background: COLORS.WARNING,
      };
    case THEME_TYPES.DANGER:
      return {
        borderColor: COLORS.DANGER,
        background: COLORS.DANGER,
      };
    default:
      return {
        borderColor: COLORS.PRIMARY,
        background: COLORS.PRIMARY,
      };
  }
};

const Checkbox = ({ classes, value = false, label, type = THEME_TYPES.PRIMARY, onClick }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={classes.container}>
      <input
        type="checkbox"
        className={classes.hiddenCheckboxInput}
        checked={value}
        onChange={(event) => {
          onClick && onClick(event);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div
        className={classnames(
          classes.checkbox,
          isFocused && classes.checkboxFocused,
          classes[type],
        )}
        style={getCheckboxStyle(value, type)}
        onClick={(event) => onClick && onClick(event)}
      >
        {value && <img className={classes.checkmark} src={CheckmarkSVG} alt="Checkbox" />}
      </div>
      {!!label && (
        <div className={classes.label} onClick={(event) => onClick && onClick(event)}>
          {label}
        </div>
      )}
    </div>
  );
};
export default withStyles(styles)(Checkbox);

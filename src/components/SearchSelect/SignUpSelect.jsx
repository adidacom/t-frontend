import React, { createRef, useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { COLORS } from '../../utils/theme';

const TRANSITION_TIME = 150; // milliseconds
const BACKGROUND = '#ffffff';

const styles = {
  container: {
    position: 'relative',
    width: 264,
    height: 40,
  },
  inputContainer: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 20,
    border: `none`,
    borderRadius: 16,
    width: '100%',
    height: '100%',
    background: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    boxSizing: 'border-box',
    textAlign: 'left',
    color: '#171717',
    cursor: 'pointer',
    boxShadow: '0px 2px 24px 4px rgba(0, 0, 0, 0.1)',
    '-moz-box-shadow': '0px 2px 24px 4px rgba(0, 0, 0, 0.1)',
    '-webkit-box-shadow': '0px 2px 24px 4px rgba(0, 0, 0, 0.1)',
  },
  optionsContainer: {
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
    maxHeight: 300,
    background: BACKGROUND,
    overflowY: 'auto',
    border: `1px ${COLORS.BASIC300} solid`,
    borderRadius: 28,
  },
  list: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  listItem: {
    margin: 0,
    padding: '10px 25px',
    width: '100%',
    height: 40,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.MAIN,
    textAlign: 'left',
    cursor: 'pointer',
    userSelect: 'none',
    '&:hover': {
      background: 'rgba(144, 149, 162, 0.2)',
    },
  },
  listItemSelected: {
    background: 'rgba(144, 149, 162, 0.2)',
  },
  listItemNoResults: {
    fontSize: 15,
    color: COLORS.MAIN,
    borderBottom: `1px ${COLORS.BASIC300} solid`,
    padding: 11,
    margin: 0,
  },
  animationEnter: {
    background: BACKGROUND,
    opacity: 0,
    overflow: 'hidden',
  },
  animationEnterActive: {
    background: BACKGROUND,
    opacity: 1,
    transition: `all ${TRANSITION_TIME}ms`,
    transitionTimingFunction: 'cubic-bezier(0.65, 0.05, 0.36, 1)',
  },
  animationExit: {
    background: BACKGROUND,
    opacity: 1,
    overflow: 'hidden',
  },
  animationExitActive: {
    background: BACKGROUND,
    opacity: 0,
    transition: `all ${TRANSITION_TIME}ms`,
    transitionTimingFunction: 'cubic-bezier(0.65, 0.05, 0.36, 1)',
  },
};

const SingUpSelect = ({ classes, options, value, placeholder, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [cursorIndex, setCursorIndex] = useState(-1);
  const inputRef = useRef();

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  const optionRefs = options.reduce((acc, _value, idx) => {
    acc[idx] = createRef();
    return acc;
  }, {});

  const handleOnInputFocus = () => {
    setShowOptions(true);
  };
  const handleOnInputBlur = () => {
    setCursorIndex(-1);
    setShowOptions(false);
  };

  const handleOnMouseEnterResultItem = (_el, idx) => setCursorIndex(idx);

  // @dev: Assumes controlled component
  const handleItemSelect = (item, idx) => {
    onChange && onChange(item, idx);
    setShowOptions(false);
    inputRef && inputRef.current && inputRef.current.blur();
  };

  const handleKeyDown = (event) => {
    if (!showOptions) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        setShowOptions(true);
      }
      return;
    }

    if (event.key === 'ArrowUp' && cursorIndex > 0) {
      setCursorIndex(cursorIndex - 1);
    } else if (event.key === 'ArrowDown' && cursorIndex < options.length - 1) {
      setCursorIndex(cursorIndex + 1);
    } else if (event.key === 'Enter' && cursorIndex >= 0 && cursorIndex < options.length) {
      handleItemSelect(options[cursorIndex], cursorIndex);
    } else if (event.key === 'Enter' && cursorIndex < 0) {
      // Means an item was cleared
      handleItemSelect(null, -1);
    } else if (event.key === 'Escape') {
      setShowOptions(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.inputContainer}>
        <input
          type="text"
          ref={inputRef}
          className={classes.input}
          autoComplete="false"
          placeholder={placeholder}
          onFocus={handleOnInputFocus}
          onBlur={handleOnInputBlur}
          onKeyDown={handleKeyDown}
          value={inputValue}
          readOnly
        />
      </div>
      <CSSTransition
        in={showOptions}
        timeout={TRANSITION_TIME}
        classNames={{
          enter: classes.animationEnter,
          enterActive: classes.animationEnterActive,
          exit: classes.animationExit,
          exitActive: classes.animationExitActive,
        }}
        unmountOnExit
      >
        <div className={classes.optionsContainer}>
          <ul className={classes.list}>
            {options.map((option, idx) => (
              <li
                className={classnames(
                  classes.listItem,
                  idx === cursorIndex && classes.listItemSelected,
                )}
                key={option}
                ref={optionRefs[idx]}
                onClick={() => handleItemSelect(option, idx)}
                onMouseEnter={() => handleOnMouseEnterResultItem(option, idx)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      </CSSTransition>
    </div>
  );
};

export default withStyles(styles)(SingUpSelect);

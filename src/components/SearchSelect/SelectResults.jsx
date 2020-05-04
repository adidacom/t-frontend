import React, { createRef, useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { COLORS } from '../../utils/theme';

const TRANSITION_TIME = 150; // milliseconds
const BACKGROUND = '#ffffff';

const styles = {
  container: {
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
    maxHeight: 300,
    background: BACKGROUND,
    overflowY: 'auto',
    border: `1px ${COLORS.BASIC300} solid`,
    borderRadius: 4,
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    width: '100%',
    height: '100%',
    fontSize: 13,
    fontWeight: 500,
    color: COLORS.BASIC800,
    padding: 16,
    margin: 0,
    borderBottom: `1px ${COLORS.BASIC300} solid`,
    cursor: 'pointer',
    userSelect: 'none',
    '&:hover': {
      background: COLORS.BASIC200,
    },
  },
  listItemSubtitle: {
    fontSize: 12,
    fontWeight: 400,
    color: COLORS.BASIC600,
  },
  listItemSelected: {
    background: COLORS.BASIC200,
  },
  listItemNoResults: {
    fontSize: 15,
    color: COLORS.BASIC600,
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

const SelectResults = ({
  classes,
  show = false,
  items = [],
  cursorIndex = -1,
  onClickItem,
  onMouseEnterItem,
}) => {
  const itemRefs = items.reduce((acc, _value, idx) => {
    acc[idx] = createRef();
    return acc;
  }, {});

  useEffect(() => {
    if (itemRefs[cursorIndex]) {
      itemRefs[cursorIndex].current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [cursorIndex]);

  return (
    <CSSTransition
      in={show}
      timeout={TRANSITION_TIME}
      classNames={{
        enter: classes.animationEnter,
        enterActive: classes.animationEnterActive,
        exit: classes.animationExit,
        exitActive: classes.animationExitActive,
      }}
      unmountOnExit
    >
      <div className={classes.container}>
        <ul className={classes.list}>
          {items.length ? (
            items.map((item, idx) => (
              <li
                className={classNames(
                  classes.listItem,
                  idx === cursorIndex && classes.listItemSelected,
                )}
                key={`${JSON.stringify(item.title)}-${item.subtitle}`}
                ref={itemRefs[idx]}
                onClick={() => onClickItem && onClickItem(item, idx)}
                onMouseEnter={() => onMouseEnterItem && onMouseEnterItem(item, idx)}
              >
                {item.title}
                <br />
                {!!item.subtitle && (
                  <span className={classes.listItemSubtitle}>{item.subtitle}</span>
                )}
              </li>
            ))
          ) : (
            <li className={classes.listItemNoResults}>No matching results...</li>
          )}
        </ul>
      </div>
    </CSSTransition>
  );
};

export default withStyles(styles)(SelectResults);

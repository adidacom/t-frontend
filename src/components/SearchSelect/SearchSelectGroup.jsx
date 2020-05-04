import React from 'react';
import { withStyles } from '@material-ui/styles';
import { COLORS } from '../../utils/theme';
import SearchSelect from './SearchSelect';
import { SELECT_ICON_TYPES } from './SelectIcon';

// TODO: Possible to do this nudging with CSS?
const LEFT_NUDGE_INCREMENT = 6;

const styles = {
  container: {},
  selectContainer: {
    position: 'relative',
    '&:not(:last-child)': {
      marginBottom: 8,
      '&:before': {
        content: '""',
        width: 6,
        height: 35,
        position: 'absolute',
        borderLeft: `2px ${COLORS.INFO300} solid`,
        borderBottom: `2px ${COLORS.INFO300} solid`,
        left: 1,
        top: 20,
      },
    },
  },
};

const getIcon = (dropdownDepth, currentDepth, value) => {
  if (!value) {
    return SELECT_ICON_TYPES.ADD;
  }
  return dropdownDepth === currentDepth ? SELECT_ICON_TYPES.ADD : SELECT_ICON_TYPES.REMOVE;
};
const getThin = (dropdownDepth, currentDepth) => dropdownDepth < currentDepth - 1;
const getPlaceholder = (dropdownDepth, placeholders) =>
  dropdownDepth ? placeholders.GENERAL : placeholders.FIRST;

// Definition: onChange(depth, selection)
const SearchSelectGroup = ({
  classes,
  lists,
  values,
  placeholders,
  isLoading,
  onChange,
  onIconClick,
}) => (
  <div className={classes.container}>
    {lists.map((list, idx) => (
      <div
        // eslint-disable-next-line react/no-array-index-key
        key={`${idx}`}
        className={classes.selectContainer}
        style={{ left: idx * LEFT_NUDGE_INCREMENT }}
      >
        <SearchSelect
          placeholder={getPlaceholder(idx, placeholders) || ''}
          thin={getThin(idx, lists.length)}
          items={list}
          value={values[idx] || ''}
          iconType={getIcon(idx, lists.length, values[idx])}
          isLoading={isLoading ? isLoading[idx] : false}
          onSelect={(el) => onChange && onChange(idx, el)}
          onIconClick={() => onIconClick && onIconClick(idx)}
        />
      </div>
    ))}
  </div>
);

export default withStyles(styles)(SearchSelectGroup);

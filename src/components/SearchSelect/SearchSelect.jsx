import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import Fuse from 'fuse.js';
import { COLORS } from '../../utils/theme';
import SelectIcon from './SelectIcon';
import SelectResults from './SelectResults';

const DEFAULT_FUSE_JS_OPTIONS = {
  keys: ['title'],
  shouldSort: true,
  distance: 1000,
  threshold: 0.2,
};

const styles = {
  container: {
    width: 340,
    position: 'relative',
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    padding: '12px 50px 12px 12px',
    background: COLORS.BASIC200,
    border: `1px ${COLORS.BASIC400} solid`,
    borderRadius: 4,
    fontSize: '15px',
    fontWeight: 500,
    textOverflow: 'ellipsis',
    color: COLORS.BASIC800,
    transition: 'height 0.1s ease-out',
    position: 'relative',
    '&:hover': {
      background: COLORS.BASIC300,
    },
    '&:focus': {
      height: 48,
      background: COLORS.BASIC100,
      border: `1px ${COLORS.PRIMARY500} solid`,
      outline: 'none',
    },
    '&::placeholder': {
      fontWeight: 400,
      color: COLORS.BASIC600,
    },
  },
  inputThin: {
    height: 32,
    padding: '6px 50px 6px 12px',
  },
};

const SearchSelect = ({
  classes,
  items,
  value,
  placeholder,
  thin = false,
  iconType,
  isLoading = false,
  minSearchLength = 1,
  resultsSortFunction,
  onSelect,
  onIconClick,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState(items);
  const [showResults, setShowResults] = useState(false);
  const [cursorIndex, setCursorIndex] = useState(-1);
  const [fuseSearch, setFuseSearch] = useState(new Fuse(items, DEFAULT_FUSE_JS_OPTIONS));
  const inputRef = useRef();

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // TODO: Need better solution than JSON.stringify
  useEffect(() => {
    setFuseSearch(new Fuse(items, DEFAULT_FUSE_JS_OPTIONS));
    setResults(items);
  }, [JSON.stringify(items)]);

  const handleOnInputFocus = () => {
    setResults(items);
    setShowResults(true);
  };
  const handleOnInputBlur = () => {
    setCursorIndex(-1);
    setShowResults(false);
    if (value !== inputValue) {
      setInputValue(value);
    }
  };
  const handleOnMouseEnterResultItem = (_el, idx) => setCursorIndex(idx);

  const handleInputChange = (event) => {
    const newInputValue = event.target.value;
    let newResults = items;
    let newShowResults = true;

    if (newInputValue.length) {
      newShowResults = newInputValue.length >= minSearchLength;
      newResults = newShowResults ? fuseSearch.search(newInputValue) : [];
      resultsSortFunction && newResults.sort((a, b) => resultsSortFunction(a.title, b.title));
    }

    setResults(newResults);
    setShowResults(newShowResults);
    setInputValue(newInputValue);
    setCursorIndex(-1);
  };

  // @dev: Assumes controlled component
  const handleItemSelect = (item, idx) => {
    onSelect && onSelect(item, idx);
    setShowResults(false);
    if (inputRef && inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (event) => {
    if (!showResults) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        setShowResults(true);
      }
      return;
    }

    if (event.key === 'ArrowUp' && cursorIndex > 0) {
      setCursorIndex(cursorIndex - 1);
    } else if (event.key === 'ArrowDown' && cursorIndex < results.length - 1) {
      setCursorIndex(cursorIndex + 1);
    } else if (event.key === 'Enter' && cursorIndex >= 0 && cursorIndex < results.length) {
      handleItemSelect(results[cursorIndex], cursorIndex);
    } else if (event.key === 'Enter' && cursorIndex < 0) {
      // Means an item was cleared
      handleItemSelect(null, -1);
    } else if (event.key === 'Escape') {
      setShowResults(false);
    }
  };

  const handleIconClick = () => {
    if (inputRef && inputRef.current && !inputValue) {
      if (!showResults) {
        inputRef.current.focus();
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }
    onIconClick && onIconClick();
  };

  return (
    <div className={classes.container}>
      <div className={classes.inputContainer}>
        <input
          type="text"
          ref={inputRef}
          className={classnames(classes.input, thin && classes.inputThin)}
          autoComplete="false"
          placeholder={placeholder}
          onFocus={handleOnInputFocus}
          onBlur={handleOnInputBlur}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={inputValue}
        />
        <SelectIcon iconType={iconType} onClick={handleIconClick} isLoading={isLoading} />
      </div>
      <SelectResults
        show={showResults}
        items={results}
        cursorIndex={cursorIndex}
        onClickItem={(item, idx) => handleItemSelect(item, idx)}
        onMouseEnterItem={handleOnMouseEnterResultItem}
      />
    </div>
  );
};

export default withStyles(styles)(SearchSelect);

import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import Fuse from 'fuse.js';
import { COLORS } from '../../utils/theme';
import SelectResults from './SelectResults';
import SearchSVGBasic600 from '../../assets/svg/search_large_basic600.svg';
import SearchSVGBasic800 from '../../assets/svg/search_large_basic800.svg';

const DEFAULT_FUSE_JS_OPTIONS = {
  keys: ['title'],
  shouldSort: true,
  distance: 1000,
  threshold: 0.2,
};

const styles = {
  container: {
    position: 'relative',
    display: 'block',
    width: 450,
  },
  icon: {
    height: 21,
    position: 'absolute',
    bottom: 11,
    left: 5,
  },
  input: {
    fontSize: 26,
    fontWeight: 700,
    width: '100%',
    color: COLORS.BASIC800,
    margin: '0 20px 0 0',
    paddingLeft: 36,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    border: 'none',
    borderBottom: `2px ${COLORS.BASIC400} solid`,
    caretColor: COLORS.BASIC800,
    outline: 'none',
    '&::placeholder': {
      color: COLORS.BASIC600,
      fontWeight: 500,
    },
    '&:focus': {
      borderBottom: `2px ${COLORS.BASIC800} solid`,
    },
  },
};

const getIconSVG = (isInFocus) => (isInFocus ? SearchSVGBasic800 : SearchSVGBasic600);

const BigSearchSelect = ({
  classes,
  items,
  value,
  placeholder,
  minSearchLength = 1,
  resultsSortFunction,
  onSelect,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isInFocus, setIsInFocus] = useState(false);
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
    setShowResults(!!inputValue);
    setIsInFocus(true);
  };

  const handleOnInputBlur = () => {
    setCursorIndex(-1);
    setShowResults(false);
    setIsInFocus(false);
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

  const handleItemSelect = (item, idx) => {
    onSelect && onSelect(item, idx);
    setShowResults(false);
    inputRef && inputRef.current && inputRef.current.blur();
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

  return (
    <div className={classes.container}>
      <input
        type="text"
        ref={inputRef}
        className={classes.input}
        autoComplete="false"
        placeholder={placeholder}
        onFocus={handleOnInputFocus}
        onBlur={handleOnInputBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={inputValue}
      />
      <img className={classes.icon} src={getIconSVG(isInFocus)} alt="Search for an industry" />
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

export default withStyles(styles)(BigSearchSelect);

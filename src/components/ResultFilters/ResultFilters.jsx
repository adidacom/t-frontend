import React from 'react';
import { withStyles } from '@material-ui/styles';
import _ from 'lodash';
import FilterButton from './FilterButton';
import ToggleButton from './ToggleButton';
import QuickFilter from './QuickFilter';

const DESC = 'DESC';
const ASC = 'ASC';

const styles = {
  container: {
    display: 'flex',
  },
  buttonContainer: {
    marginRight: 8,
  },
};

const SORT_ORDER_MAPPING = {
  [DESC]: -1,
  [ASC]: 1,
};

const getNextSortOrder = (order) => {
  if (!order) {
    return 'DESC';
  }
  return order === 'DESC' ? 'ASC' : null;
};

const ResultFilters = ({ classes, value, onChange }) => {
  const { sortField, sortOrder, quickFilter = '', freeReportsOnly } = value;

  const getSortValue = (key) => {
    if (key === sortField) {
      return SORT_ORDER_MAPPING[sortOrder];
    }
    return 0;
  };

  const handleSortClick = (key) => {
    let nextSortOrder = getNextSortOrder(null);
    if (key === sortField) {
      nextSortOrder = getNextSortOrder(sortOrder);
    }

    onChange({
      sortField: key,
      sortOrder: nextSortOrder,
      quickFilter,
      freeReportsOnly,
      eventSource: key,
    });
  };

  const handleQuickFilterChange = (event) => {
    const nextValue = event.target.value;
    onChange({
      sortField,
      sortOrder,
      quickFilter: nextValue,
      freeReportsOnly,
      eventSource: 'quickFilter',
    });
  };

  const handleFreeReportsOnlyClick = () => {
    const nextValue = !freeReportsOnly;
    onChange({
      sortField,
      sortOrder,
      quickFilter,
      freeReportsOnly: nextValue,
    });
  };

  return (
    <div className={classes.container}>
      <FilterButton
        className={classes.buttonContainer}
        label="Date"
        value={getSortValue('datePublished')}
        onClick={() => handleSortClick('datePublished')}
      />
      <FilterButton
        className={classes.buttonContainer}
        label="Quality"
        value={getSortValue('quality')}
        onClick={() => handleSortClick('quality')}
      />
      <ToggleButton
        className={classes.buttonContainer}
        label="Free Reports Only"
        value={freeReportsOnly}
        onClick={handleFreeReportsOnlyClick}
      />
      <QuickFilter
        value={quickFilter}
        placeholder="Filter results for keywords"
        onChange={handleQuickFilterChange}
      />
    </div>
  );
};

const arePropsEqual = (prevProps, nextProps) => _.isEqual(prevProps.value, nextProps.value);

export default withStyles(styles)(React.memo(ResultFilters, arePropsEqual));

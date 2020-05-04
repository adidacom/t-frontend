import React from 'react';
import { withStyles } from '@material-ui/styles';
import { COLORS } from '../../utils/theme';
import ResultChip, { RESULT_CHIP_TYPES } from '../SearchResult/ResultChip';
import { getLastElement } from '../../utils/tools';

const styles = {
  container: {
    minWidth: 350,
    padding: '10px 16px 4px 16px',
    borderRadius: 2,
    border: `1px ${COLORS.BASIC300} solid`,
    cursor: 'pointer',
    userSelect: 'none',
    marginBottom: 8,
    marginRight: 8,
    boxShadow: '0 2px 4px rgba( 0, 0, 0, 0.03)',
    '&:hover': {
      boxShadow: '0 4px 5px rgba( 0, 0, 0, 0.12)',
    },
  },
  title: {
    fontSize: 18,
    color: COLORS.PRIMARY500,
    fontWeight: 700,
    marginBottom: 7,
  },
  chipsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipWrapper: {
    marginBottom: 8,
  },
};

const RecSearch = ({ classes, title, searchParams, onClick }) => (
  <div className={classes.container} onClick={onClick}>
    <h4 className={classes.title}>{title}</h4>
    <div className={classes.chipsContainer}>
      <div className={classes.chipWrapper}>
        <ResultChip
          title={getLastElement(searchParams.industry)}
          chipType={RESULT_CHIP_TYPES.INDUSTRY}
        />
      </div>
      {!!searchParams.metric && (
        <div className={classes.chipWrapper}>
          <ResultChip title={searchParams.metric} chipType={RESULT_CHIP_TYPES.METRIC} />
        </div>
      )}
      {!!searchParams.segmentation && !!searchParams.segmentation.length && (
        <div className={classes.chipWrapper}>
          <ResultChip title={searchParams.segmentation} chipType={RESULT_CHIP_TYPES.SEGMENT} />
        </div>
      )}
    </div>
  </div>
);

export default withStyles(styles)(RecSearch);

import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { COLORS } from '../../utils/theme';
import ResultChip, { RESULT_CHIP_TYPES } from './ResultChip';

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    '&:not(:last-child)': {
      marginBottom: 8,
    },
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  byText: {
    fontSize: 13,
    fontWeight: 400,
    color: COLORS.BASIC800,
    marginRight: 8,
  },
  statsUnit: {
    fontSize: 13,
    fontWeight: 400,
    color: COLORS.BASIC800,
    marginRight: 20,
  },
  year: {
    minWidth: 75,
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.BASIC700,
    textAlign: 'right',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  unit: {
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.BASIC700,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  page: {
    minWidth: 90,
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.PRIMARY500,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  separatorCircle: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.BASIC500,
    margin: '0 6px',
  },
  whiteBackground: {
    backgroundColor: 'white',
  },
};

const StatisticsDataset = ({ classes, metric, unit, year, page, showPage = true }) => {
  return (
    <div className={classes.container}>
      <ResultChip title={metric} chipType={RESULT_CHIP_TYPES.METRIC} />
      <span className={classes.statsUnit}>{unit}</span>
      <div className={classes.rightContainer}>
        <span className={classes.year}>{year}</span>
        <span className={classnames(classes.separatorCircle, !page && classes.whiteBackground)} />
        {showPage && <span className={classes.page}>{page || ''}</span>}
      </div>
    </div>
  );
};

const NormalDataset = ({
  classes,
  industry,
  metric,
  segments,
  year,
  unit,
  page,
  showPage = true,
}) => (
  <div className={classes.container}>
    <ResultChip title={industry} chipType={RESULT_CHIP_TYPES.INDUSTRY} />
    <ResultChip title={metric} chipType={RESULT_CHIP_TYPES.METRIC} />
    {!!segments && !!segments.length && (
      <Fragment>
        <span className={classes.byText}>by</span>
        {segments.map((el, idx) => (
          <ResultChip
            title={el}
            chipType={RESULT_CHIP_TYPES.SEGMENT}
            // eslint-disable-next-line react/no-array-index-key
            key={`${industry}-${metric}-${el}-${unit}-${idx}`}
          />
        ))}
      </Fragment>
    )}
    <div className={classes.rightContainer}>
      <span className={classes.year}>{year}</span>
      <span className={classes.separatorCircle} />
      <span className={classes.unit}>{unit}</span>
      <span className={classnames(classes.separatorCircle, !page && classes.whiteBackground)} />
      {showPage && <span className={classes.page}>{page || ''}</span>}
    </div>
  </div>
);

const ResultDataset = ({ isStatisticsData, ...props }) =>
  isStatisticsData ? <StatisticsDataset {...props} /> : <NormalDataset {...props} />;

export default withStyles(styles)(ResultDataset);

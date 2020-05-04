import React, { useState } from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import AnimateHeight from 'react-animate-height';
import { COLORS } from '../../utils/theme';
import ResultStars from './ResultStars';
import Dataset from './ResultDataset';
import ExpandDatasetsButton from './ExpandDatasetsButton';

const NUMBER_DATASETS_BEFORE_BREAK = 2;

const styles = {
  container: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: 2,
    border: `1px ${COLORS.BASIC300} solid`,
    boxShadow: '0 2px 4px rgba( 0, 0, 0, 0.03)',
    '&:hover': {
      boxShadow: '0 4px 5px rgba( 0, 0, 0, 0.18)',
    },
    '&:not(:last-child)': {
      marginBottom: 8,
    },
    userSelect: 'none',
  },
  headerContainer: {
    borderBottom: `1px ${COLORS.BASIC300} solid`,
    paddingBottom: 7,
  },
  headerBottomLineContainer: {
    display: 'flex',
  },
  datasetContainer: {
    paddingTop: 12,
    paddingBottom: 7,
    '&:not(:last-child)': {
      paddingBottom: 12,
    },
  },
  additionalDatasetsContainer: {
    borderTop: `1px ${COLORS.BASIC300} solid`,
    paddingTop: 12,
    paddingBottom: 7,
  },
  separatorCircle: {
    width: 2,
    height: 2,
    borderRadius: 1,
    background: COLORS.BASIC500,
    margin: 'auto 6px',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.PRIMARY500,
    lineHeight: '24px',
  },
  publisher: {
    fontSize: 15,
    fontWeight: 400,
    color: COLORS.BASIC800,
  },
  date: {
    fontSize: 12,
    fontWeight: 400,
    color: COLORS.BASIC800,
    textTransform: 'uppercase',
    lineHeight: '26px',
  },
  price: {
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.PRIMARY700,
    textTransform: 'uppercase',
    lineHeight: '26px',
  },
  priceFree: {
    color: COLORS.PRIMARY500,
  },
  marginTop14: {
    marginTop: 14,
  },
};

const isPriceFree = (price) => price.toUpperCase() === 'FREE';

const SearchResult = ({
  classes,
  title,
  publisher,
  quality,
  date,
  price,
  url,
  datasets,
  containsPageNumbers,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const topDatasets = datasets.slice(0, NUMBER_DATASETS_BEFORE_BREAK);
  const bottomDatasets = datasets.slice(NUMBER_DATASETS_BEFORE_BREAK);

  const toggleIsExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className={classes.container}>
      <a href={url} target="_blank" rel="noopener noreferrer" onClick={() => onClick && onClick()}>
        <div className={classes.headerContainer}>
          <span className={classes.title}>{title}</span>
          <div className={classes.headerBottomLineContainer}>
            <span className={classes.publisher}>{publisher}</span>
            <span className={classes.separatorCircle} />
            <ResultStars number={quality} />
            <span className={classes.separatorCircle} />
            <span className={classes.date}>{date}</span>
            <span className={classes.separatorCircle} />
            <span className={classnames(classes.price, isPriceFree(price) && classes.priceFree)}>
              {price}
            </span>
          </div>
        </div>
      </a>
      <div className={classes.datasetContainer}>
        {topDatasets.map((el, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Dataset key={`${title}-${idx}`} showPage={containsPageNumbers} {...el} />
        ))}
      </div>
      {datasets.length > 2 && (
        <div className={classes.additionalDatasetsContainer}>
          <AnimateHeight
            duration={180}
            height={isExpanded ? 'auto' : 0}
            animateOpacity
            easing="ease-out"
          >
            {bottomDatasets.map((el, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Dataset key={`${title}-${idx}`} showPage={containsPageNumbers} {...el} />
            ))}
          </AnimateHeight>
          <ExpandDatasetsButton
            className={classnames(isExpanded && classes.marginTop14)}
            label={isExpanded ? 'Collapse datasets' : `View ${bottomDatasets.length} more datasets`}
            arrowUp={isExpanded}
            onClick={toggleIsExpanded}
          />
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(SearchResult);

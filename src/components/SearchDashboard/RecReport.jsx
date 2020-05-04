import React from 'react';
import { withStyles } from '@material-ui/styles';
import { COLORS } from '../../utils/theme';
import ResultStars from '../SearchResult/ResultStars';

const styles = {
  container: {
    width: 529,
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
    lineHeight: '22px',
    height: 44,
    fontWeight: 700,
    color: COLORS.PRIMARY500,
    lineClamp: 2,
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
  },
  infoLineContainer: {
    display: 'flex',
    marginTop: 2,
    alignItems: 'center',
  },
  separatorCircle: {
    width: 2,
    height: 2,
    borderRadius: 1,
    background: COLORS.BASIC500,
    margin: 'auto 6px',
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
};

const RecReport = ({ classes, publisher, quality, date, title, onClick }) => (
  <div className={classes.container} onClick={onClick}>
    <span className={classes.title}>{title}</span>
    <div className={classes.infoLineContainer}>
      <span className={classes.publisher}>{publisher}</span>
      <span className={classes.separatorCircle} />
      <span className={classes.date}>{date}</span>
      <span className={classes.separatorCircle} />
      <ResultStars number={quality} />
    </div>
  </div>
);

export default withStyles(styles)(RecReport);

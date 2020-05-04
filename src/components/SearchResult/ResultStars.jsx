import React from 'react';
import { withStyles } from '@material-ui/styles';
import StarSVG from '../../assets/svg/star.svg';

const styles = {
  container: {
    display: 'inline-block',
  },
  star: {
    width: 14,
    height: 14,
    '&:not(:last-child)': {
      marginRight: 2,
    },
  },
};

const generateAltText = (number) => `${number} Star${number === 1 ? '' : 's'}`;
const ResultStars = ({ classes, number = 1 }) => (
  <div className={classes.container}>
    {[...new Array(number)].map((_el, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <img src={StarSVG} key={idx} className={classes.star} alt={generateAltText(number)} />
    ))}
  </div>
);

export default withStyles(styles)(ResultStars);

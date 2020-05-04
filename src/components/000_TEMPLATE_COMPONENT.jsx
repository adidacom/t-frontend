import React from 'react';
import { withStyles } from '@material-ui/styles';
import { COLORS } from '../utils/theme';

const styles = {
  container: {
    width: '100%',
    color: COLORS.PRIMARY,
  },
};

const Template = ({ classes }) => (
  <div className={classes.container}>This is my component template.</div>
);

export default withStyles(styles)(Template);

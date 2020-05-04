import React from 'react';
import { withStyles } from '@material-ui/styles';
import { COLORS } from '../../utils/theme';

const styles = {
  container: {
    width: '100%',
    padding: '10px 16px',
    userSelect: 'none',
  },
  headerContainer: {
    borderBottom: `1px ${COLORS.BASIC300} solid`,
    paddingBottom: 7,
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.INFO800,
    lineHeight: '24px',
  },
  messageContainer: {
    padding: '7px 0',
    fontSize: 15,
    color: COLORS.BASIC800,
  },
};

const MessageSearchResult = ({ classes, title, message, onClick }) => (
  <div className={classes.container} onClick={onClick}>
    {!!title && <div className={classes.headerContainer}>{title}</div>}
    <div className={classes.messageContainer}>{message}</div>
  </div>
);

export default withStyles(styles)(MessageSearchResult);

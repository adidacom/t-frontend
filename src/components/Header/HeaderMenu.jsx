import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../redux';
import { COLORS } from '../../utils/theme';

const styles = {
  container: {},
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    width: '100%',
    height: '100%',
    fontSize: 13,
    fontWeight: 500,
    color: COLORS.BASIC800,
    padding: '12px 40px 12px 16px',
    margin: 0,
    borderBottom: `1px ${COLORS.BASIC300} solid`,
    cursor: 'pointer',
    userSelect: 'none',
    '&:hover': {
      background: COLORS.BASIC200,
    },
  },
};

const HeaderMenu = ({ classes, onWatchVideoClick, logoutUser }) => (
  <div className={classes.container}>
    <ul className={classes.list}>
      <Link to="/settings">
        <li className={classes.listItem}>Settings</li>
      </Link>
      <Link to="/settings/help">
        <li className={classes.listItem}>Help</li>
      </Link>
      <li className={classes.listItem} onClick={onWatchVideoClick}>
        Watch tutorial video
      </li>
      <li className={classes.listItem} onClick={logoutUser}>
        Log out
      </li>
    </ul>
  </div>
);

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => {
    window.location.href = '/login';
    dispatch(logout());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(HeaderMenu));

import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Link, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { COLORS } from '../../utils/theme';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: '14px 24px',
    paddingTop: 50,
  },
  sectionSelector: {
    width: '100%',
    textAlign: 'right',
    fontSize: 20,
    fontWeight: 500,
    color: COLORS.PRIMARY300,
    marginBottom: 30,
    userSelect: 'none',
    cursor: 'pointer',
    transition: 'all 0.18s ease-out',
    '&:hover': {
      color: COLORS.PRIMARY500,
    },
  },
  activeSection: {
    color: COLORS.PRIMARY500,
  },
};

const SettingsSidebar = ({ classes, match }) => {
  const { page } = match.params;
  const isHelpPage = page && page === 'help';

  return (
    <div className={classes.container}>
      <Link to="/settings">
        <div className={classnames(classes.sectionSelector, !isHelpPage && classes.activeSection)}>
          Account Security
        </div>
      </Link>
      <Link to="/settings/help">
        <div className={classnames(classes.sectionSelector, isHelpPage && classes.activeSection)}>
          Help
        </div>
      </Link>
      <Link to="/">
        <div className={classes.sectionSelector}>Back To Search</div>
      </Link>
    </div>
  );
};

export default withStyles(styles)(withRouter(SettingsSidebar));

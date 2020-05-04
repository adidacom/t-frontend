import React from 'react';
import { withStyles } from '@material-ui/styles';
import { COLORS } from '../../utils/theme';

const styles = {
  container: {
    display: 'inline-block',
    padding: '6px 12px',
    marginRight: 8,
    fontSize: 11,
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
    borderRadius: 4,
    whiteSpace: 'nowrap',
  },
};

export const RESULT_CHIP_TYPES = {
  INDUSTRY: 'INDUSTRY',
  METRIC: 'METRIC',
  SEGMENT: 'SEGMENT',
};

const ResultChip = ({ classes, title, chipType, background, ...props }) => {
  let chipBackground = background;

  if (chipType) {
    switch (chipType) {
      case RESULT_CHIP_TYPES.INDUSTRY:
        chipBackground = COLORS.PRIMARY500;
        break;
      case RESULT_CHIP_TYPES.METRIC:
        chipBackground = COLORS.SUCCESS500;
        break;
      case RESULT_CHIP_TYPES.SEGMENT:
        chipBackground = COLORS.INFO500;
        break;
      default:
        chipBackground = COLORS.PRIMARY500;
    }
  }

  return (
    <div className={classes.container} style={{ background: chipBackground }} {...props}>
      {title}
    </div>
  );
};

export default withStyles(styles)(ResultChip);

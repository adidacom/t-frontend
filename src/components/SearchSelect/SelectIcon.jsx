import React from 'react';
import { withStyles } from '@material-ui/styles';
import classnames from 'classnames';
import { Spin } from 'antd';
import { COLORS } from '../../utils/theme';
import DropdownSVG from '../../assets/svg/dropdown_info500.svg';
import AddSVG from '../../assets/svg/add.svg';
import RemoveSVG from '../../assets/svg/remove.svg';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    width: 20,
    height: 20,
    borderRadius: 3,
    border: `1px ${COLORS.PRIMARY} solid`,
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  loadingContainer: {
    border: 'none !important',
    backgroundColor: 'transparent !important',
  },
  dropdownIcon: {
    border: `1px ${COLORS.INFO500} solid`,
    backgroundColor: COLORS.INFO100,
  },
  addIcon: {
    border: `1px ${COLORS.SUCCESS500} solid`,
    backgroundColor: COLORS.SUCCESS100,
  },
  removeIcon: {
    border: `1px ${COLORS.DANGER500} solid`,
    backgroundColor: COLORS.DANGER100,
  },
};

export const SELECT_ICON_TYPES = {
  DROPDOWN: 'DROPDOWN',
  ADD: 'ADD',
  REMOVE: 'REMOVE',
};

const SelectIcon = ({
  classes,
  iconType = SELECT_ICON_TYPES.DROPDOWN,
  isLoading = false,
  ...props
}) => {
  let iconImgSrc;
  let iconClass;

  if (iconType) {
    switch (iconType) {
      case SELECT_ICON_TYPES.DROPDOWN:
        iconImgSrc = DropdownSVG;
        iconClass = classes.dropdownIcon;
        break;
      case SELECT_ICON_TYPES.ADD:
        iconImgSrc = AddSVG;
        iconClass = classes.addIcon;
        break;
      case SELECT_ICON_TYPES.REMOVE:
        iconImgSrc = RemoveSVG;
        iconClass = classes.removeIcon;
        break;
      default:
        iconImgSrc = DropdownSVG;
        iconClass = classes.dropdownIcon;
    }
  }

  return (
    <div
      className={classnames(classes.container, iconClass, isLoading && classes.loadingContainer)}
      {...props}
    >
      {isLoading ? (
        <Spin size="default" />
      ) : (
        <img
          src={iconImgSrc}
          alt="Select icon"
          style={{
            width: styles.container.width / 2,
          }}
        />
      )}
    </div>
  );
};

export default withStyles(styles)(SelectIcon);

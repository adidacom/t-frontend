import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BadgeWrapper } from './badge.style';

class Badge extends Component {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { type, className, ...props } = this.props;
    const typeString =
      type[0].toUpperCase() +
      String(type)
        .substr(1, type.length - 1)
        .toLowerCase();

    return (
      <BadgeWrapper type={type} className={`badge-wrapper ${className}`} {...props}>
        {typeString}
      </BadgeWrapper>
    );
  }
}

export default Badge;

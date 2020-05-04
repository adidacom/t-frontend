import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Badge from '../Badge';

import { CardWrapper } from './card.style';

class Card extends Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    datetime: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    data: PropTypes.array,
    hasMore: PropTypes.bool,
    onLoadMore: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    name: '',
    datetime: '',
    type: '',
    title: '',
    description: '',
    data: [],
    hasMore: false,
    onLoadMore: () => {},
  };

  renderContent = () => {
    const { data } = this.props;

    return data.map((rowData, index) => {
      const { type, from, to, location, page } = rowData;

      return (
        <div className="card-content-row" key={index}>
          <div className="card-content-badge">
            {type.map((typeValue, ind) => (
              <Badge type={typeValue} key={ind} />
            ))}
          </div>
          <div className="card-content-stats">
            <div className="card-content-datetime">
              {from} - {to}
            </div>
            <div className="card-content-location">{location}</div>
            <div className="card-content-page">{page}</div>
          </div>
        </div>
      );
    });
  };

  renderHasMore = () => {
    const { hasMore, onLoadMore } = this.props;

    if (hasMore) {
      return (
        <div className="card-has-more">
          <p onClick={onLoadMore}>+ View more datasets</p>
        </div>
      );
    }
    return '';
  };

  render() {
    const { name, datetime, type, title, description, hasMore, className, ...props } = this.props;

    return (
      <CardWrapper className={`card-wrapper ${className}`} {...props}>
        <div className="card-header">
          <div className="card-stats-info">
            <div className="card-name">{name}</div>
            <div className="card-info-right">
              <div className="card-datetime">{datetime}</div>
              <div className="card-type">{type}</div>
            </div>
          </div>
          <div className="card-header-info">
            <div className="card-title">{title}</div>
            <div className="card-description">{description}</div>
          </div>
        </div>
        <div className="card-body">
          {this.renderContent()}
          {this.renderHasMore()}
        </div>
      </CardWrapper>
    );
  }
}

export default Card;

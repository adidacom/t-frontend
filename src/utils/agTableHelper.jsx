import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { QUALITY_MAX_STARS } from '../config';

const REPORT_KEYS = {
  NAME: 'name',
  DESCRIPTION: 'description',
  LAST_PUBLISHED: 'datePublished',
  QUALITY: 'quality',
  COMPLETENESS: 'completeness',
  KEYWORDS: 'keywords',
  REGIONS: 'regions',
  PRICE: 'price',
  URL: 'url',
  PUBLISHER: 'Publisher',
  REPORT_BRANCHES: 'ReportBranches',
};

const PUBLISHER_KEYS = {
  NAME: 'name',
  QUALITY: 'quality',
  DESCRIPTION: 'description',
};

const REPORT_BRANCH_KEYS = {
  INDUSTRY: 'industry',
  DATA: 'data',
  UNIT_DESCRIPTION: 'unitDescription',
  COMPLETENESS: 'completeness',
};

function PublisherCellRenderer(props, handleCTAClick, showDataSet) {
  if (props.data.isTrailCTA) {
    if (showDataSet) {
      return (
        <div className="ResultsTable__cta-row">
          <div className="ResultsTable__cta-button-wrapper">
            <div className="ResultsTable__cta-button">
              Upgrade to access the rest of the results!
            </div>
            <div className="ResultsTable__cta-button-shimmer" onClick={handleCTAClick} />
          </div>
        </div>
      );
    }

    if (props.data.resultsCount <= 3) {
      return (
        <div className="ResultsTable__cta-row">
          <span>
            {`Showing ${props.data.resultsCount} of ${props.data.resultsCount} matching reports...`}
          </span>
          <div className="ResultsTable__cta-button-wrapper">
            <div className="ResultsTable__cta-button">
              Upgrade to access the entire T4 Platform!
            </div>
            <div className="ResultsTable__cta-button-shimmer" onClick={handleCTAClick} />
          </div>
        </div>
      );
    }

    return (
      <div className="ResultsTable__cta-row">
        <span>{`Showing 3 of ${props.data.resultsCount} matching reports...`}</span>
        <div className="ResultsTable__cta-button-wrapper">
          <div className="ResultsTable__cta-button">Upgrade to access the rest of the results!</div>
          <div className="ResultsTable__cta-button-shimmer" onClick={handleCTAClick} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
      <Tooltip
        title={props.value[PUBLISHER_KEYS.DESCRIPTION]}
        placement="right"
        classes={{ tooltip: 'ResultsTable__tooltip', popper: 'ResultsTable__popper' }}
      >
        <span>{props.value[PUBLISHER_KEYS.NAME]}</span>
      </Tooltip>
    </div>
  );
}

function ReportNameRenderer(props, handleReportUrlClick) {
  const name = props.data[REPORT_KEYS.NAME];
  const url = props.data[REPORT_KEYS.URL];
  const ReportId = props.data.id;
  const ReportBranchId = props.data[REPORT_KEYS.REPORT_BRANCHES][0].id;

  return (
    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
      <a
        href={url}
        onClick={() => handleReportUrlClick(ReportId, name, url, ReportBranchId)}
        target="_blank"
        rel="noreferrer noopener"
      >
        {name}
      </a>
    </div>
  );
}

function LastPublishedCellRenderer(props) {
  if (!props.value) return <div>Current</div>;

  return <div>{moment(props.value).format('MMM YYYY')}</div>;
}

function QualityCellRenderer(props) {
  const numStars = Number(props.value);
  const stars = [];

  for (let i = 0; i < QUALITY_MAX_STARS; i++) {
    stars.push(
      <FontAwesomeIcon
        key={i}
        className={numStars > i ? 'color--blue-gray' : 'hidden'}
        icon={faStar}
      />,
    );
  }

  return stars;
}

export const defaultColumnDefinition = {
  sortable: false,
  resizable: true,
};

// TODO: Clean up return value calculation
export function columnDefinitions(
  showDataSet = false,
  isFreeTrail = false,
  handleReportUrlClick = () => {},
  handleCTAClick = () => {},
) {
  const HEADER_CLASS_ALIGN_CENTER = 'ResultsTable__header';
  const HEADER_CLASS_ALIGN_LEFT = `${HEADER_CLASS_ALIGN_CENTER} text--align--left`;
  const CELL_CLASS_ALIGN_CENTER = 'ResultsTable__cell';
  const CELL_CLASS_DARK_GRAY_TEXT_ALIGN_CENTER = `${CELL_CLASS_ALIGN_CENTER} color--dark--gray`;
  const CELL_CLASS_DARK_GRAY_TEXT_ALIGN_LEFT = `${CELL_CLASS_DARK_GRAY_TEXT_ALIGN_CENTER} text--align--left`;
  const CELL_CLASS_DARK_GRAY_TEXT_ALIGN_LEFT_WRAPPED = `${CELL_CLASS_DARK_GRAY_TEXT_ALIGN_LEFT} text--wrap`;

  const colDefs = [
    {
      headerName: 'Publisher',
      field: REPORT_KEYS.PUBLISHER,
      cellRendererFramework: (props) => PublisherCellRenderer(props, handleCTAClick, showDataSet),
      minWidth: 110,
      width: 115,
      autoHeight: (props) => props.data.isTrailCTA,
      colSpan: (props) => (props.data.isTrailCTA ? 6 + showDataSet : 1),
      headerClass: HEADER_CLASS_ALIGN_LEFT,
      cellClass: CELL_CLASS_DARK_GRAY_TEXT_ALIGN_LEFT,
      getQuickFilterText: (props) => props.value[PUBLISHER_KEYS.NAME],
      sortable: false,
    },
    {
      headerName: 'Report Name',
      field: REPORT_KEYS.NAME,
      minWidth: 360,
      headerClass: HEADER_CLASS_ALIGN_LEFT,
      cellClass: CELL_CLASS_DARK_GRAY_TEXT_ALIGN_LEFT,
      cellRendererFramework: (props) => ReportNameRenderer(props, handleReportUrlClick),
    },
    {
      // Using Last Published for Region Keywords, Keywords, and Industry Quick Filter
      headerName: 'Last Published',
      field: REPORT_KEYS.LAST_PUBLISHED,
      minWidth: 130,
      maxWidth: 130,
      sortable: !isFreeTrail,
      cellRendererFramework: LastPublishedCellRenderer,
      headerClass: HEADER_CLASS_ALIGN_LEFT,
      cellClass: CELL_CLASS_DARK_GRAY_TEXT_ALIGN_CENTER,
      getQuickFilterText: (props) =>
        `${props.data[REPORT_KEYS.REGIONS] ? props.data[REPORT_KEYS.REGIONS].join(' ') : ''} ${props
          .data[REPORT_KEYS.KEYWORDS] || ''} ${props.data[REPORT_KEYS.REPORT_BRANCHES]
          .map((branch) => branch.industry[branch.industry.length - 1])
          .join(' ')}`,
    },
  ];

  if (showDataSet) {
    colDefs.push(
      {
        headerName: 'Unit Description',
        minWidth: 160,
        headerClass: HEADER_CLASS_ALIGN_LEFT,
        cellClass: CELL_CLASS_DARK_GRAY_TEXT_ALIGN_LEFT,
        valueGetter: (props) =>
          props.data[REPORT_KEYS.REPORT_BRANCHES][0][REPORT_BRANCH_KEYS.UNIT_DESCRIPTION],
      },
      {
        headerName: 'Dataset Description',
        minWidth: 400,
        autoHeight: true,
        headerClass: HEADER_CLASS_ALIGN_LEFT,
        cellClass: CELL_CLASS_DARK_GRAY_TEXT_ALIGN_LEFT_WRAPPED,
        valueGetter: (props) => {
          if (props.data.isTrailCTA) {
            return '';
          }
          return props.data[REPORT_KEYS.REPORT_BRANCHES][0][REPORT_BRANCH_KEYS.DATA].message;
        },
      },
    );
  } else {
    colDefs.push({
      headerName: 'Report Description',
      field: REPORT_KEYS.DESCRIPTION,
      minWidth: 400,
      autoHeight: true,
      headerClass: HEADER_CLASS_ALIGN_LEFT,
      cellClass: CELL_CLASS_DARK_GRAY_TEXT_ALIGN_LEFT_WRAPPED,
    });
  }

  colDefs.push(
    {
      headerName: 'Quality',
      field: REPORT_KEYS.QUALITY,
      cellRendererFramework: QualityCellRenderer,
      minWidth: 70,
      maxWidth: 100,
      sortable: !isFreeTrail,
      headerClass: HEADER_CLASS_ALIGN_LEFT,
      cellClass: CELL_CLASS_DARK_GRAY_TEXT_ALIGN_CENTER,
      getQuickFilterText: () => '',
    },
    {
      headerName: 'Price',
      field: REPORT_KEYS.PRICE,
      maxWidth: 100,
      sortable: !isFreeTrail,
      cellRenderer: (params) => (params.value >= 0 ? `$${params.value}` : 'N/A'),
      headerClass: HEADER_CLASS_ALIGN_LEFT,
      cellClass: CELL_CLASS_DARK_GRAY_TEXT_ALIGN_CENTER,
      getQuickFilterText: () => '',
    },
  );

  return colDefs;
}

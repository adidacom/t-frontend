import moment from 'moment';
import numeral from 'numeral';
import { SURVEY_AND_STATISTICS_INDUSTRY } from './constants';

export const mapListToSearchDropdown = (list) =>
  list.map((el) => ({
    title: el,
  }));

const mapDatasetYear = (timeFrom, timeTo) => {
  const yearFrom = new Date(timeFrom).getUTCFullYear();
  const yearTo = new Date(timeTo).getUTCFullYear();

  if (yearFrom === yearTo) {
    return yearFrom;
  }

  return `${yearFrom} - ${yearTo}`;
};

const isReportBranchStatisticsData = (reportBranch) =>
  reportBranch.industry.length > 2 && reportBranch.industry[2] === SURVEY_AND_STATISTICS_INDUSTRY;

export const mapReportBranchToDataSet = (reportBranch) => ({
  industry: reportBranch.industry[reportBranch.industry.length - 1],
  metric: reportBranch.metric,
  segments: reportBranch.segmentation || null,
  unit: reportBranch.unitDescription,
  year: mapDatasetYear(reportBranch.timeFrom, reportBranch.timeTo),
  page: reportBranch.page ? `Page ${reportBranch.page}` : null,
  description: reportBranch.data.message,
  isStatisticsData: isReportBranchStatisticsData(reportBranch),
});

const mapSearchResultPrice = (price) => {
  if (price < 0) {
    return 'Contact Publisher For Price';
  }
  if (price === 0) {
    return 'Free';
  }
  return numeral(price).format('$0,0');
};

const isReportContainsPageNumbers = (reportBranches) =>
  !!reportBranches.find((reportBranch) => !!reportBranch.page);

export const mapReportToResult = (report) => ({
  key: report.id,
  publisher: report.Publisher.name,
  quality: report.quality,
  date: moment(report.datePublished).format('MMM YYYY'),
  price: mapSearchResultPrice(report.price),
  title: report.name,
  url: report.url,
  datasets: report.ReportBranches.map((reportBranch) => mapReportBranchToDataSet(reportBranch)),
  containsPageNumbers: isReportContainsPageNumbers(report.ReportBranches),
});

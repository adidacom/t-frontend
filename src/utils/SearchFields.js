import _ from 'lodash';
import uuid from 'uuid/v4';
import {
  getDropdown as dropdownAPICall,
  getDistinctIndustries as getIndustriesAPICall,
} from './api';
import { mapListToSearchDropdown } from './mappers';
import { NO_SEGMENTATION } from './constants';

const industryListToSearchDropdown = (industries) => {
  const industrySearchItems = [];
  for (let i = 0; i < industries.length; i++) {
    const industry = industries[i];
    for (let j = 1; j < industry.length + 1; j++) {
      const path = industry.slice(0, j);
      const node = {
        title: path[j - 1],
        path,
        subtitle: path.join(' > '),
      };
      const nodeAlreadyExists = !!industrySearchItems.find(
        (item) => item.subtitle === node.subtitle,
      );
      if (!nodeAlreadyExists) industrySearchItems.push(node);
    }
  }
  return industrySearchItems;
};

class SearchFields {
  constructor() {
    this.sectors = [];
    this.industryPaths = [[]];
    this.industryDropdowns = [[]];
    this.industry = [];
    this.excludeSubindustries = false;
    this.metricDropdown = [];
    this.metric = '';
    this.segmentDropdowns = [[]];
    this.segment = [];
    this.initialized = false;
    this.lastUpdateHash = '';
  }

  updateHash() {
    const newUpdateHash = uuid();
    this.lastUpdateHash = newUpdateHash;
    return newUpdateHash;
  }

  async initialize() {
    const industryPaths = await getIndustriesAPICall();
    let sectors = industryPaths.map((industry) => industry[0]);
    sectors = _.uniq(sectors);
    sectors.sort();
    this.sectors = sectors;
    this.industryPaths = industryPaths;
    this.industryDropdowns = [industryListToSearchDropdown(industryPaths)];
    this.initialized = true;

    return this.updateHash();
  }

  get searchParams() {
    // TODO: Improve this
    const industry = [...this.industry];
    if (this.excludeSubindustries) {
      industry.push('N/A');
    }
    const segment = [...this.segment];
    const lastSegment = segment[segment.length - 1];
    if (lastSegment === NO_SEGMENTATION) {
      segment.pop();
      segment.push('No Segmentation');
    }

    return {
      industry: industry.length ? industry : undefined,
      metric: this.metric || undefined,
      segmentation: segment.length ? segment : undefined,
    };
  }

  get industryTitle() {
    return this.industry[this.industry.length - 1];
  }

  get isIndustrySelected() {
    return !!this.industry.length;
  }

  updateIndustryDropdowns(industryLevel, industryList) {
    const oldDropdowns = this.industryDropdowns.slice(0, industryLevel);

    if (!industryList.length) {
      this.industryDropdowns = oldDropdowns;
      return;
    }

    // Means new dropdown only has "N/A" option
    if (industryList.length === 1 && industryList[0] === null) {
      this.industryDropdowns = oldDropdowns;
      return;
    }

    const newIndustrylist = [...industryList];

    // TODO: Improve this
    // Means N/A Industry At End
    if (!industryList[industryList.length - 1]) {
      newIndustrylist.pop();
    }

    const newDropdown = mapListToSearchDropdown(newIndustrylist);

    this.industryDropdowns = [...oldDropdowns, newDropdown];
  }

  updateMetricDropdown(metricList) {
    this.metricDropdown = mapListToSearchDropdown(metricList);
  }

  updateSegmentDropdowns(segmentLevel, segmentList) {
    const oldDropdowns = this.segmentDropdowns.slice(0, segmentLevel);

    if (!segmentList.length) {
      this.segmentDropdowns = oldDropdowns;
      return;
    }

    // TODO: improve
    // Means new dropdown only has "NO SEGMENTATION" option
    if (segmentList.length === 1 && segmentList[0] === null) {
      if (segmentLevel === 0) {
        this.segmentDropdowns = [mapListToSearchDropdown([NO_SEGMENTATION])];
        return;
      }
      this.segmentDropdowns = oldDropdowns;
      return;
    }

    // TODO: Improve this
    let newSegmentList = [...segmentList];
    // Means No Segmentation At End
    if (!segmentList[segmentList.length - 1]) {
      newSegmentList = [NO_SEGMENTATION, ...segmentList];
      newSegmentList.pop();
    }

    const newDropdown = mapListToSearchDropdown(newSegmentList);

    this.segmentDropdowns = [...oldDropdowns, newDropdown];
  }

  async industrySelectionChanged(industryLevel, selection) {
    const oldIndustry = [...this.industry];
    const newIndustry = [...this.industry.slice(0, industryLevel)];
    selection && newIndustry.push(selection);

    if (_.isEqual(oldIndustry, newIndustry)) {
      return Promise.resolve();
    }

    // Means an industry level was cleared
    if (!selection) {
      this.industry = newIndustry;
      this.excludeSubindustries = false;
      this.metric = '';
      this.segment = [];
    } else {
      this.industry = newIndustry;
      this.excludeSubindustries = false;
      this.metric = '';
      this.segment = [];
    }

    const industrySearchParams = _.pick(this.searchParams, 'industry');
    const colNames = ['industry', 'metric', 'segmentation'];
    const colSubIndexes = [newIndustry.length + 1, 0, 1];
    const dropdowns = await dropdownAPICall(industrySearchParams, colNames, colSubIndexes);
    this.updateIndustryDropdowns(newIndustry.length, dropdowns[0]);
    this.updateMetricDropdown(dropdowns[1]);
    this.updateSegmentDropdowns(0, dropdowns[2]);

    return this.updateHash();
  }

  async industryL0Changed(item) {
    // Means industry L0 was cleared
    if (!item) {
      this.industryDropdowns = [industryListToSearchDropdown(this.industryPaths)];
      this.industry = [];
      this.excludeSubindustries = false;
      this.metricDropdown = [];
      this.metric = '';
      this.segmentDropdowns = [[]];
      this.segment = [];
      return this.updateHash();
    }

    const selectedIndustry = item.path;
    for (let i = 0; i < selectedIndustry.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await this.industrySelectionChanged(i, selectedIndustry[i]);
    }
    return this.updateHash();
  }

  async industryPathChanged(item) {
    const selectedIndustry = [...item.path];
    this.excludeSubindustries = false;
    this.metricDropdown = [];
    this.metric = '';
    this.segmentDropdowns = [[]];
    this.segment = [];

    for (let i = 1; i < selectedIndustry.length; i++) {
      const curIndustry = selectedIndustry.slice(0, i);
      const industrySearchParams = { industry: curIndustry };
      const colNames = ['industry'];
      const colSubIndexes = [curIndustry.length + 1];
      // eslint-disable-next-line no-await-in-loop
      const dropdowns = await dropdownAPICall(industrySearchParams, colNames, colSubIndexes);
      this.updateIndustryDropdowns(curIndustry.length, dropdowns[0]);
    }
    const industrySearchParams = { industry: selectedIndustry };
    const colNames = ['industry', 'metric', 'segmentation'];
    const colSubIndexes = [selectedIndustry.length + 1, 0, 1];
    const dropdowns = await dropdownAPICall(industrySearchParams, colNames, colSubIndexes);
    this.updateIndustryDropdowns(selectedIndustry.length, dropdowns[0]);
    this.updateMetricDropdown(dropdowns[1]);
    this.updateSegmentDropdowns(0, dropdowns[2]);

    this.industry = [...selectedIndustry];

    return this.updateHash();
  }

  async excludeSubindustriesChanged(value) {
    if (this.excludeSubindustries === value) {
      return Promise.resolve();
    }

    this.excludeSubindustries = value;
    this.metric = '';
    this.segment = [];

    const industrySearchParams = _.pick(this.searchParams, 'industry');
    const colNames = ['metric', 'segmentation'];
    const colSubIndexes = [0, 1];
    const dropdowns = await dropdownAPICall(industrySearchParams, colNames, colSubIndexes);

    this.updateMetricDropdown(dropdowns[0]);
    this.updateSegmentDropdowns(0, dropdowns[1]);

    return this.updateHash();
  }

  async metricSelectionChanged(selection) {
    if (this.metric === selection) {
      return Promise.resolve();
    }

    // Means metric was cleared
    if (!selection) {
      this.metric = '';
    } else {
      this.metric = selection;
      this.segment = [];
    }

    const metricSearchParams = _.pick(this.searchParams, ['industry', 'metric']);
    const colNames = ['segmentation'];
    const colSubIndexes = [1];
    const dropdowns = await dropdownAPICall(metricSearchParams, colNames, colSubIndexes);

    this.updateSegmentDropdowns(0, dropdowns[0]);
    return this.updateHash();
  }

  async segmentSelectionChanged(segmentLevel, selection) {
    const oldSegment = [...this.segment];
    const newSegment = [...this.segment.slice(0, segmentLevel)];
    selection && newSegment.push(selection);

    if (_.isEqual(oldSegment, newSegment)) {
      return Promise.resolve();
    }

    this.segment = newSegment;

    if (selection === NO_SEGMENTATION) {
      this.updateSegmentDropdowns(newSegment.length, []);
    } else {
      const colNames = ['segmentation'];
      const colSubIndexes = [newSegment.length + 1];
      const dropdowns = await dropdownAPICall(this.searchParams, colNames, colSubIndexes);
      this.updateSegmentDropdowns(newSegment.length, dropdowns[0]);
    }

    return this.updateHash();
  }
}

export default SearchFields;

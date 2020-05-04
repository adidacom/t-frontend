import { getDropdown as dropdownAPICall } from './api';

// TODO: Refactor and clean up this file

function createPristineDropdownObj(
  placeholder,
  columnName,
  colSubIndex = 0,
  visible = true,
  disabled = true,
  grayTitle = true,
  error = false,
  loading = false,
) {
  return {
    list: [],
    placeholder,
    columnName,
    colSubIndex,
    visible,
    disabled,
    grayTitle,
    error,
    loading,
  };
}

function createDropdownItem(key, id, title, selected = false) {
  return {
    key,
    id,
    title,
    selected,
  };
}

export const INDUSTRY0 = 'INDUSTRY0';
export const INDUSTRY1 = 'INDUSTRY1';
export const INDUSTRY2 = 'INDUSTRY2';
export const INDUSTRY3 = 'INDUSTRY3';
export const INDUSTRY4 = 'INDUSTRY4';
export const INDUSTRY5 = 'INDUSTRY5';
export const METRIC = 'METRIC';
export const SEGMENTATION0 = 'SEGMENTATION0';
export const SEGMENTATION1 = 'SEGMENTATION1';
export const SEGMENTATION2 = 'SEGMENTATION2';
export const TIME_UNIT = 'TIME_UNIT';
export const TIME_FROM = 'TIME_FROM';
export const TIME_TO = 'TIME_TO';
export const DATA_UNIT = 'DATA_UNIT';
export const FREE_REPORTS_ONLY = 'FREE_REPORTS_ONLY';

const NO_SEGMENTATION = 'No Segmentation';
const NA_INDUSTRY = 'N/A';
const NA_DATA_UNIT = 'N/A';

const SEARCH_STEPS = [
  INDUSTRY0,
  INDUSTRY1,
  INDUSTRY2,
  INDUSTRY3,
  INDUSTRY4,
  INDUSTRY5,
  METRIC,
  SEGMENTATION0,
  SEGMENTATION1,
  SEGMENTATION2,
  DATA_UNIT,
];

const STEP_MAPPING = {};
SEARCH_STEPS.map((value, index) => (STEP_MAPPING[value] = index));

export const STEP_COLUMN_MAPPING = {
  INDUSTRY0: {
    column: 'industry',
    index: 1,
  },
  INDUSTRY1: {
    column: 'industry',
    index: 2,
  },
  INDUSTRY2: {
    column: 'industry',
    index: 3,
  },
  INDUSTRY3: {
    column: 'industry',
    index: 4,
  },
  INDUSTRY4: {
    column: 'industry',
    index: 5,
  },
  INDUSTRY5: {
    column: 'industry',
    index: 6,
  },
  METRIC: {
    column: 'metric',
    index: 0,
  },
  SEGMENTATION0: {
    column: 'segmentation',
    index: 1,
  },
  SEGMENTATION1: {
    column: 'segmentation',
    index: 2,
  },
  SEGMENTATION2: {
    column: 'segmentation',
    index: 3,
  },
  TIME_UNIT: {
    column: 'timeUnit',
    index: 0,
  },
  TIME_FROM: {
    column: 'timeFrom',
    index: 0,
  },
  TIME_TO: {
    column: 'timeTo',
    index: 0,
  },
  DATA_UNIT: {
    column: 'dataUnit',
    index: 0,
  },
};

export const FORCE_DATASET_METRICS = ['Survey & Statistics Data'];
export const FORCE_DATASET_INDUSTRIES = ['Survey & Statistics Data'];

function SEARCH_DEFAULTS() {
  return {
    INDUSTRY0: createPristineDropdownObj(
      'Sector',
      STEP_COLUMN_MAPPING[INDUSTRY0].column,
      STEP_COLUMN_MAPPING[INDUSTRY0].index,
      true,
      false,
    ),
    INDUSTRY1: createPristineDropdownObj(
      'Industry Level 1',
      STEP_COLUMN_MAPPING[INDUSTRY1].column,
      STEP_COLUMN_MAPPING[INDUSTRY1].index,
    ),
    INDUSTRY2: createPristineDropdownObj(
      'Industry Level 2',
      STEP_COLUMN_MAPPING[INDUSTRY2].column,
      STEP_COLUMN_MAPPING[INDUSTRY2].index,
      false,
    ),
    INDUSTRY3: createPristineDropdownObj(
      'Industry Level 3',
      STEP_COLUMN_MAPPING[INDUSTRY3].column,
      STEP_COLUMN_MAPPING[INDUSTRY3].index,
      false,
    ),
    INDUSTRY4: createPristineDropdownObj(
      'Industry Level 4',
      STEP_COLUMN_MAPPING[INDUSTRY4].column,
      STEP_COLUMN_MAPPING[INDUSTRY4].index,
      false,
    ),
    INDUSTRY5: createPristineDropdownObj(
      'Industry Level 5',
      STEP_COLUMN_MAPPING[INDUSTRY5].column,
      STEP_COLUMN_MAPPING[INDUSTRY5].index,
      false,
    ),
    METRIC: createPristineDropdownObj('Metric', STEP_COLUMN_MAPPING[METRIC].column),
    SEGMENTATION0: createPristineDropdownObj(
      'Segment Level 1',
      STEP_COLUMN_MAPPING[SEGMENTATION0].column,
      STEP_COLUMN_MAPPING[SEGMENTATION0].index,
    ),
    SEGMENTATION1: createPristineDropdownObj(
      'Segment Level 2',
      STEP_COLUMN_MAPPING[SEGMENTATION1].column,
      STEP_COLUMN_MAPPING[SEGMENTATION1].index,
      false,
    ),
    SEGMENTATION2: createPristineDropdownObj(
      'Segment Level 3',
      STEP_COLUMN_MAPPING[SEGMENTATION2].column,
      STEP_COLUMN_MAPPING[SEGMENTATION2].index,
      false,
    ),
    TIME_FROM: {
      value: '',
    },
    TIME_TO: {
      value: '',
    },
    DATA_UNIT: createPristineDropdownObj('Data Unit', STEP_COLUMN_MAPPING[DATA_UNIT].column),
    FREE_REPORTS_ONLY: {
      value: false,
    },
  };
}

function getFieldSelection(searchFields, fieldKey) {
  if (fieldKey === TIME_FROM || fieldKey === TIME_TO || fieldKey === FREE_REPORTS_ONLY) {
    const { value } = searchFields[fieldKey];
    if (!value) return null;

    return value;
  }

  const { list } = searchFields[fieldKey];
  for (let i = 0; i < list.length; i++) {
    if (list[i].selected) return list[i].title;
  }

  return null;
}

// TODO: Refactor completely....
function getSearchParams(searchFields, stopAtField) {
  const stopIndex = STEP_MAPPING[stopAtField];

  const searchParams = {
    industry: [getFieldSelection(searchFields, INDUSTRY0)],
  };
  if (stopIndex > STEP_MAPPING[INDUSTRY0]) {
    const selection = getFieldSelection(searchFields, INDUSTRY1);
    if (selection) searchParams.industry.push(selection);
  }
  if (stopIndex > STEP_MAPPING[INDUSTRY1]) {
    const selection = getFieldSelection(searchFields, INDUSTRY2);
    if (selection) searchParams.industry.push(selection);
  }
  if (stopIndex > STEP_MAPPING[INDUSTRY2]) {
    const selection = getFieldSelection(searchFields, INDUSTRY3);
    if (selection) searchParams.industry.push(selection);
  }
  if (stopIndex > STEP_MAPPING[INDUSTRY3]) {
    const selection = getFieldSelection(searchFields, INDUSTRY4);
    if (selection) searchParams.industry.push(selection);
  }
  if (stopIndex > STEP_MAPPING[INDUSTRY4]) {
    const selection = getFieldSelection(searchFields, INDUSTRY5);
    if (selection) searchParams.industry.push(selection);
  }
  if (stopIndex > STEP_MAPPING[INDUSTRY5]) {
    const selection = getFieldSelection(searchFields, METRIC);
    if (selection) searchParams.metric = selection;
  }
  if (stopIndex > STEP_MAPPING[METRIC]) {
    searchParams.segmentation = [];
    const selection = getFieldSelection(searchFields, SEGMENTATION0);
    if (selection) searchParams.segmentation.push(selection);
  }
  if (stopIndex > STEP_MAPPING[SEGMENTATION0]) {
    const selection = getFieldSelection(searchFields, SEGMENTATION1);
    if (selection) searchParams.segmentation.push(selection);
  }
  if (stopIndex > STEP_MAPPING[SEGMENTATION1]) {
    const selection = getFieldSelection(searchFields, SEGMENTATION2);
    if (selection) searchParams.segmentation.push(selection);
  }
  if (stopIndex > STEP_MAPPING[SEGMENTATION2]) {
    const selection = getFieldSelection(searchFields, DATA_UNIT);
    if (selection) searchParams.dataUnit = selection;
  }

  // Time-related Filters
  if (stopIndex > STEP_MAPPING[SEGMENTATION2]) {
    const selection = getFieldSelection(searchFields, TIME_FROM);
    if (selection) searchParams.timeFrom = `'${new Date(selection).toDateString()}'`;
  }
  if (stopIndex > STEP_MAPPING[SEGMENTATION2]) {
    const selection = getFieldSelection(searchFields, TIME_TO);
    if (selection) searchParams.timeTo = `'${new Date(selection).toDateString()}'`;
  }

  // Free Reports only Filter
  if (stopIndex > STEP_MAPPING[SEGMENTATION2]) {
    const selection = getFieldSelection(searchFields, FREE_REPORTS_ONLY);
    if (selection) searchParams.freeReportsOnly = selection;
  }

  return searchParams;
}

// TODO: Handle timeFrom and timeTo more uniformly
class SearchFields {
  constructor(industriesEnabled = [], initSearchParams = {}, searchFunction) {
    this.searchFields = SEARCH_DEFAULTS();
    this.industriesEnabled = industriesEnabled;
    this.searchFunction = searchFunction;

    const industries = [];
    let count = 0;
    for (let i = 0; i < industriesEnabled.length; i++) {
      const curIndustry = industriesEnabled[i][0];
      if (!industries.includes(curIndustry)) {
        this.searchFields[INDUSTRY0].list.push(createDropdownItem(INDUSTRY0, count, curIndustry));
        industries.push(curIndustry);
        count++;
      }
    }

    if (Object.keys(initSearchParams).length > 0) {
      this.initWithSearchParams(initSearchParams);
    }
  }

  async initWithSearchParams(searchParams) {
    // Select Dropdowns to match industry
    if (searchParams.industry) {
      const industrySteps = [INDUSTRY0, INDUSTRY1, INDUSTRY2, INDUSTRY3, INDUSTRY4, INDUSTRY5];
      for (let i = 0; i < searchParams.industry.length; i++) {
        const industry = searchParams.industry[i];
        const dropdownList = this.searchFields[industrySteps[i]].list;
        const dropdownId = dropdownList.findIndex((item) => industry === item.title);
        if (dropdownId < 0) break;
        else {
          await this.dropdownSelectionChanged(industrySteps[i], dropdownId, industry);
        }
      }
    }

    // Select Dropdowns to match metric
    if (searchParams.metric) {
      const { metric } = searchParams;
      const dropdownList = this.searchFields[METRIC].list;
      const dropdownId = dropdownList.findIndex((item) => metric === item.title);
      if (dropdownId >= 0) {
        await this.dropdownSelectionChanged(METRIC, dropdownId, metric);
      }
    }

    // Select Dropdowns to match segmentation. 1st level only.
    if (searchParams.segmentation) {
      const { segmentation } = searchParams;
      const dropdownList = this.searchFields[SEGMENTATION0].list;
      const dropdownId = dropdownList.findIndex((item) => segmentation === item.title);
      if (dropdownId >= 0) {
        await this.dropdownSelectionChanged(SEGMENTATION0, dropdownId, segmentation);
      }
    }

    if (this.searchFunction) {
      this.searchFunction();
    }
  }

  // this. Wrapper
  getFieldSelection(fieldKey) {
    return getFieldSelection(this.searchFields, fieldKey);
  }

  getTitle(fieldKey) {
    const { placeholder } = this.searchFields[fieldKey];
    const selection = this.getFieldSelection(fieldKey);

    return selection || placeholder;
  }

  // this. Wrapper
  getSearchParams(stopAtField = DATA_UNIT) {
    return getSearchParams(this.searchFields, stopAtField);
  }

  // Returns Promise
  getDropdownList(fieldKey) {
    const stepIndex = STEP_MAPPING[fieldKey];
    const searchParams = this.getSearchParams(SEARCH_STEPS[stepIndex - 1]);
    const fieldObj = this.searchFields[fieldKey];
    return dropdownAPICall(searchParams, fieldObj.columnName, fieldObj.colSubIndex);
  }

  // Returns Promise
  getDropdownLists(fieldKeys) {
    const searchParams = this.getSearchParams(fieldKeys[0]);
    const colNames = [];
    const colSubIndexes = [];

    for (let i = 0; i < fieldKeys.length; i++) {
      const fieldObj = this.searchFields[fieldKeys[i]];
      colNames.push(fieldObj.columnName);
      colSubIndexes.push(fieldObj.colSubIndex);
    }

    return dropdownAPICall(searchParams, colNames, colSubIndexes);
  }

  /* eslint-disable class-methods-use-this */
  createDropdownListFromStringList(fieldKey, stringList) {
    const stepIndex = STEP_MAPPING[fieldKey];

    // Handle Industry cases
    if (stepIndex <= STEP_MAPPING[INDUSTRY5]) {
      if (stringList[stringList.length - 1] === null) {
        stringList.pop();
        stringList.unshift(NA_INDUSTRY);
      }
    }

    // Handle Segmentation cases
    else if (stepIndex <= STEP_MAPPING[SEGMENTATION2] && stepIndex >= STEP_MAPPING[SEGMENTATION0]) {
      if (stringList[stringList.length - 1] === null) {
        stringList.pop();
        stringList.unshift(NO_SEGMENTATION);
      }
    }

    // Handle Metric case (Put Sales on top)
    else if (fieldKey === METRIC && stringList.length > 1) {
      const salesIndex = stringList.indexOf('Sales');
      if (salesIndex >= 0) {
        stringList.splice(salesIndex, 1);
        stringList.unshift('Sales');
      }
    }

    // Handle Data Unit case
    else if (fieldKey === DATA_UNIT) {
      if (stringList[stringList.length - 1] === null) {
        stringList.pop();
        stringList.unshift(NA_DATA_UNIT);
      }
    }

    return stringList.map((item, index) => createDropdownItem(fieldKey, index, item));
  }
  /* eslint-enable class-methods-use-this */

  // Only works with timeFrom & timeTo
  setValue(key, value) {
    this.searchFields[key].value = value;
  }

  async dropdownSelectionChanged(key, id, title) {
    // Deselect all options and select new option
    this.searchFields[key].error = false;
    const searchFieldList = this.searchFields[key].list;
    for (let i = 0; i < searchFieldList.length; i++) {
      searchFieldList[i].selected = false;
    }
    searchFieldList[id].selected = true;
    this.searchFields[key].grayTitle = false;

    const stepNumber = SEARCH_STEPS.indexOf(key);
    if (stepNumber < 0) return;

    // Reset all dropdowns in front
    for (let i = stepNumber + 1; i < SEARCH_STEPS.length; i++) {
      const sField = SEARCH_STEPS[i];
      this.searchFields[sField] = SEARCH_DEFAULTS()[sField];
      this.searchFields[sField].grayTitle = true;
    }

    const activateField = (fieldKey, stringList) => {
      this.searchFields[fieldKey].visible = true;
      this.searchFields[fieldKey].disabled = false;
      this.searchFields[fieldKey].grayTitle = true;
      this.searchFields[fieldKey].loading = true;
      this.searchFields[fieldKey].list = this.createDropdownListFromStringList(
        fieldKey,
        stringList,
      );
      this.searchFields[fieldKey].loading = false;
    };

    // Get Dropdown options and enable dropdown in front
    // Re-do "N/A & No Segmentation" quick fix.
    if (stepNumber + 1 < SEARCH_STEPS.length) {
      const fieldsToActivate = [];

      let nextField = SEARCH_STEPS[stepNumber + 1];
      if (title === NA_INDUSTRY) nextField = METRIC;
      else if (title === NO_SEGMENTATION) nextField = DATA_UNIT;

      // Make next industry or segmentation fields visible
      if (title !== NA_INDUSTRY || title !== NO_SEGMENTATION) {
        this.searchFields[nextField].visible = true;
      }
      fieldsToActivate.push(nextField);

      // Enable Segmentation Dropdown alongside Metric Dropdown
      if (nextField === METRIC) {
        fieldsToActivate.push(SEGMENTATION0);
      }

      // Industry Cases
      if (
        stepNumber < SEARCH_STEPS.indexOf(METRIC) &&
        nextField !== SEGMENTATION0 &&
        nextField !== METRIC
      ) {
        fieldsToActivate.push(SEGMENTATION0);
        fieldsToActivate.push(METRIC);
      }

      if (stepNumber < SEARCH_STEPS.indexOf(DATA_UNIT) && nextField !== DATA_UNIT) {
        fieldsToActivate.push(DATA_UNIT);
      }

      const stringLists = await this.getDropdownLists(fieldsToActivate);

      for (let i = 0; i < fieldsToActivate.length; i++) {
        const fieldKey = fieldsToActivate[i];
        activateField(fieldKey, stringLists[i]);
      }
    }
  }

  // TODO: Needs refactoring! Need to fix N/A case!
  areAllFieldsEntered() {
    let allFieldsEntered = true;
    for (let i = 0; i < SEARCH_STEPS.length; i++) {
      const curField = SEARCH_STEPS[i];
      if (curField === TIME_FROM || curField === TIME_TO) {
        continue;
      }

      const curSelection = this.getFieldSelection(curField);
      if (!curSelection) {
        allFieldsEntered = false;
        switch (curField) {
          case INDUSTRY0:
          case INDUSTRY1:
          case INDUSTRY2:
          case INDUSTRY3:
          case INDUSTRY4:
            i = STEP_MAPPING[METRIC] - 1;
            break;
          case SEGMENTATION0:
          case SEGMENTATION1:
            i = STEP_MAPPING[DATA_UNIT] - 1;
            break;
          default:
        }
      }
      if (curField !== DATA_UNIT && curSelection === NA_INDUSTRY) {
        i = STEP_MAPPING[METRIC] - 1;
      }
      if (curSelection === NO_SEGMENTATION) {
        i = STEP_MAPPING[DATA_UNIT] - 1;
      }
    }

    return allFieldsEntered;
  }

  shouldShowDataset() {
    return (
      this.areAllFieldsEntered() ||
      FORCE_DATASET_METRICS.indexOf(this.getFieldSelection(METRIC)) > -1 ||
      FORCE_DATASET_INDUSTRIES.indexOf(this.getFieldSelection(INDUSTRY2)) > -1
    );
  }

  highlightErrors() {
    let hasError = false;
    const sectorField = this.searchFields[INDUSTRY0];
    const sectorSelection = this.getFieldSelection(INDUSTRY0);

    if (!sectorSelection) {
      sectorField.error = true;
      hasError = true;
    }

    return hasError;
  }

  resetErrors() {
    for (let i = 0; i < SEARCH_STEPS.length; i++) {
      const curField = SEARCH_STEPS[i];
      this.searchFields[curField].error = false;
    }
  }
}

export default SearchFields;

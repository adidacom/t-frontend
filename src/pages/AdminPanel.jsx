/* TEMP FILE */

import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grommet, Box, Form, FormField, Select, Button, Text, DataTable } from 'grommet';
import moment from 'moment';
import Header from '../components/Header';
import {
  createAccessCode as createAccessCodeAPI,
  getAllAccessCodes as getAllAccessCodesAPI,
} from '../utils/api';

const INDUSTRY_ACCESS = ['Cybersecurity Only', 'eSports Only', 'Full Access'];
const INDUSTRY_SELECT_TO_INDUSTRIES_ENABLED_MAP = {
  'Cybersecurity Only': [['Technology', 'Cybersecurity']],
  'eSports Only': [['Technology', 'Video Gaming', 'eSports']],
  'Full Access': [['Technology']],
};
const SUBSCRIPTION_TYPES = ['PILOT', 'PROJECT'];
const FORM_FIELD_WIDTH = 250;

const isCodeValid = (codeObj) =>
  codeObj.numTimesUsed < codeObj.numTotalUses &&
  (codeObj.expiresAt ? moment().isBefore(moment(codeObj.expiresAt)) : true);

const createAccessCode = (
  code,
  industrySelect,
  subscriptionSelect,
  numTotalUses,
  expireAt,
  notes,
) => {
  const codeData = {
    subscription: {
      status: subscriptionSelect,
    },
    industriesEnabled: INDUSTRY_SELECT_TO_INDUSTRIES_ENABLED_MAP[industrySelect],
  };

  return createAccessCodeAPI(code, codeData, numTotalUses, expireAt || null, notes || null);
};

function AdminPanel(props) {
  if (props.user.role !== 'ADMIN') {
    return <Redirect to="/explorer" />;
  }
  const [infoMessage, setInfoMessage] = React.useState('');
  const [hasError, setHasError] = React.useState(false);
  const [accessCodes, setAccessCodes] = React.useState([]);

  React.useEffect(() => {
    async function getCodes() {
      const fetchedCodes = await getAllAccessCodesAPI();
      setAccessCodes(fetchedCodes);
    }

    getCodes();
  }, []);

  return (
    <Grommet background="white">
      <title>T4 | Admin Panel</title>
      <link rel="canonical" href="https://app.t4.ai/" />
      <Header />
      <Box fill align="center" pad="xlarge" background="white">
        <Form
          onSubmit={async (event) => {
            const {
              code,
              industrySelect,
              subscriptionSelect,
              numTotalUses,
              expireAt,
              notes,
            } = event.value;
            try {
              await createAccessCode(
                code,
                industrySelect,
                subscriptionSelect,
                numTotalUses,
                expireAt,
                notes,
              );
              setInfoMessage(`Code "${code}" has been created successfully`);
              const fetchedCodes = await getAllAccessCodesAPI();
              setAccessCodes(fetchedCodes);
              setHasError(false);
            } catch (e) {
              setInfoMessage(`ERROR: ${e[1]}`);
              setHasError(true);
            }
          }}
        >
          <Box gap="large" align="start" pad="medium" alignContent="center">
            <Box direction="row" gap="medium" width="large">
              <FormField
                name="code"
                label="Code"
                placeholder="Type code here"
                required
                style={{ width: FORM_FIELD_WIDTH }}
              />
              <FormField
                name="numTotalUses"
                label="Number of Uses"
                placeholder="#"
                required
                style={{ width: FORM_FIELD_WIDTH }}
                validate={(value) =>
                  Number.isInteger(Number(value)) && Number(value) > 0
                    ? ''
                    : 'Please enter a positive integer'
                }
              />
              <FormField
                name="expireAt"
                label="Expiration Date (optional)"
                validate={(value) =>
                  (Date.parse(value) && Date.parse(value) > Date.now()) || !value
                    ? ''
                    : 'Please enter a valid future date'
                }
                placeholder="mm/dd/yyyy"
                style={{ width: FORM_FIELD_WIDTH }}
              />
            </Box>
            <Box direction="row" gap="medium">
              <FormField
                name="industrySelect"
                label="Industry Access"
                options={INDUSTRY_ACCESS}
                component={(p) => <Select {...p} />}
                style={{ width: FORM_FIELD_WIDTH }}
                required
              />
              <FormField
                name="subscriptionSelect"
                label="Subscription Type"
                options={SUBSCRIPTION_TYPES}
                component={(p) => <Select {...p} />}
                style={{ width: FORM_FIELD_WIDTH }}
                required
              />
            </Box>
            <FormField
              name="notes"
              label="Notes (optional)"
              placeholder="Enter notes here"
              style={{ width: 3 * FORM_FIELD_WIDTH }}
            />
            <Button type="submit" label="Create" primary />
            {infoMessage && (
              <Text color={hasError ? 'status-error' : 'status-ok'} size="medium" weight="bold">
                {infoMessage}
              </Text>
            )}
            <DataTable
              columns={[
                {
                  property: 'code',
                  header: 'Code',
                  primary: true,
                },
                {
                  property: 'isValid',
                  header: 'Valid?',
                  render: (rowData) => (isCodeValid(rowData) ? 'Yes' : 'No'),
                },
                {
                  property: 'numTimesUsed',
                  header: 'Times Used',
                },
                {
                  property: 'numTotalUses',
                  header: 'Total Uses',
                },
                {
                  property: 'UserIds',
                  header: 'User Ids',
                  render: (rowData) => {
                    if (!rowData.UserIds) {
                      return '(none)';
                    }
                    return (
                      <Box width="400px" gap="xsmall">
                        {rowData.UserIds.map((el) => (
                          <Text key={`${rowData.code}-${el}`}>{el}</Text>
                        ))}
                      </Box>
                    );
                  },
                },
                {
                  property: 'expiresAt',
                  header: 'Expires At',
                  render: (rowData) =>
                    rowData.expiresAt ? moment(rowData.expiresAt).format('M/DD/YYYY') : '',
                },
                {
                  property: 'createdAt',
                  header: 'Created At',
                  render: (rowData) => moment(rowData.createdAt).format('M/DD/YYYY'),
                },
                {
                  property: 'notes',
                  header: 'Notes',
                },
              ]}
              data={accessCodes}
              sortable
            />
          </Box>
        </Form>
      </Box>
    </Grommet>
  );
}

export default connect((state) => ({
  user: state.user,
}))(AdminPanel);

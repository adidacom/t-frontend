import axios from 'axios';
import Cookies from 'universal-cookie';

const HUBSPOT_AXIOS = axios.create({
  baseURL: process.env.REACT_APP_HUBSPOT_FORM_ENDPOINT,
  timeout: 2 * 60 * 1000, // 2 minutes,
  headers: {
    'content-type': 'application/json',
  },
});

const cookies = new Cookies();

function submitHubspotForm({ email, product, source, medium, campaign, pageName, pageUri }) {
  const formObj = {
    email,
    ref_campaign: campaign,
    ref_content_id: pageName,
    ref_medium: medium,
    ref_product: product,
    ref_source: source,
  };

  const fields = [];
  const formKeys = Object.keys(formObj);

  for (let i = 0; i < formKeys.length; i++) {
    const key = formKeys[i];
    const val = formObj[key];
    if (val) {
      fields.push({
        name: key,
        value: val,
      });
    }
  }

  const formPostBody = {
    fields,
    context: {
      pageName,
      pageUri,
      hutk: cookies.get('hubspotutk'),
    },
  };

  return HUBSPOT_AXIOS.post('', formPostBody);
}

// eslint-disable-next-line import/prefer-default-export
export async function addContactToHubspot({ email, source, medium, campaign, pageName }) {
  const product = 'Cybersecurity';
  const pageUri = window.location.href;

  try {
    submitHubspotForm({ email, product, source, medium, campaign, pageName, pageUri });
    return true;
  } catch (e) {
    return false;
  }
}

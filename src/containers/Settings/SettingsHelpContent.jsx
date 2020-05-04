import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { Helmet } from 'react-helmet-async';
import { Radio } from 'antd';
import { COLORS } from '../../utils/theme';
import { createSupportTicket } from '../../utils/api';
import Button from '../../components/common/Button';
import LoaderOverlay from '../../components/LoaderOverlay';

const styles = {
  container: {
    width: '100%',
    margin: '14px 24px',
  },
  header: {
    fontSize: 26,
    fontWeight: 700,
    color: COLORS.PRIMARY500,
    margin: 0,
    padding: 0,
  },
  subHeader: {
    fontSize: 20,
    color: COLORS.INFO600,
    marginBottom: 20,
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 500,
    color: COLORS.INFO600,
    paddingTop: 7,
    paddingLeft: 20,
    paddingRight: 30,
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 390,
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    paddingLeft: 14,
  },
  radio: {
    marginBottom: 10,
  },
  textArea: {
    width: '100%',
    height: 200,
    padding: '10px 12px',
    marginBottom: 14,
    background: COLORS.BASIC100,
    border: `1px ${COLORS.BASIC400} solid`,
    borderRadius: 4,
    fontSize: 15,
    fontWeight: 400,
    color: COLORS.BASIC800,
    transition: 'height 0.1s ease-out',
    position: 'relative',
    resize: 'none',
    '&:hover': {
      background: COLORS.BASIC300,
    },
    '&:focus': {
      background: COLORS.BASIC100,
      border: `1px ${COLORS.PRIMARY500} solid`,
      outline: 'none',
    },
    '&::placeholder': {
      fontWeight: 400,
      color: COLORS.BASIC600,
    },
  },
  info: {
    color: COLORS.INFO700,
    fontSize: 15,
    marginTop: 10,
  },
  error: {
    color: COLORS.DANGER900,
    marginTop: 10,
  },
  gap10: {
    height: 10,
  },
};

const RADIO_VALUES = [
  'I need help finding data',
  'I need help with my account',
  'Feedback',
  'Other',
];

const SettingsHelpContent = ({ classes }) => {
  const [messageInput, setMessageInput] = useState('');
  const [radioGroupValue, setRadioGroupValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isButtonDisabled = !messageInput || isSubmitted;

  const handleSubmit = async () => {
    if (isButtonDisabled) {
      return;
    }
    try {
      setIsLoading(true);
      await createSupportTicket(RADIO_VALUES[radioGroupValue], messageInput);
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (_e) {
      setError('Please email contact@t4.ai');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError();
  }, []);

  return (
    <div className={classes.container}>
      <Helmet>
        <title>T4 | Help</title>
        <link rel="canonical" href="https://app.t4.ai/settings/help" />
      </Helmet>
      <LoaderOverlay show={isLoading} />
      <h1 className={classes.header}>What would you like help with?</h1>
      <h3 className={classes.subHeader}>We&apos;ll reply within 1 day</h3>
      <div className={classes.section}>
        <div className={classes.sectionContent}>
          <Radio.Group
            className={classes.radioGroup}
            value={radioGroupValue}
            onChange={(event) => setRadioGroupValue(event.target.value)}
          >
            {RADIO_VALUES.map((el, idx) => (
              <Radio key={el} className={classes.radio} value={idx}>
                {el}
              </Radio>
            ))}
          </Radio.Group>
          <div className={classes.gap10} />
          <textarea
            className={classes.textArea}
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
          />
          {!isSubmitted && (
            <Button label="Submit" disabled={isButtonDisabled} onClick={handleSubmit} />
          )}
          {!!error && <div className={classes.error}>{error}</div>}
          {isSubmitted && (
            <div className={classes.info}>Someone will be in touch with you shortly</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(SettingsHelpContent);

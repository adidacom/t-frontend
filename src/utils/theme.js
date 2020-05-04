import styled from 'styled-components';

export default {
  grommet: {
    extend: `
      height: 100%;
    `,
  },
  global: {
    font: {
      family: 'Circular',
      weight: '300',
      size: '14px',
      height: '20px',
    },
    colors: {
      brand: '#0062a5',
      'accent-1': '#0952b3',
      secondary: '#1e64a3',
    },
    focus: {
      border: {
        color: 'rgba(9, 154, 189, .5)',
      },
    },
  },
  formField: {
    border: {
      color: 'none',
    },
    margin: 'none',
  },
  select: {
    background: '#f2f2f2',
    options: {
      container: {
        width: '100%',
      },
    },
    container: {
      extend: {
        width: '100%',
        'font-size': '36px',
      },
    },
  },
  button: {
    border: {
      radius: '4px',
    },
    font: {
      weight: '500',
    },
    padding: {
      horizontal: '32px',
      vertical: '10px',
    },
    extend: (props) => {
      if (props.primary)
        return `
          font-family: Circular;
          font-weight: 500;
        `;
      return '';
    },
  },
  checkBox: {
    gap: 'small',
    size: '18px',
    hover: {
      border: {
        color: 'dark-3',
      },
    },
    extend: {
      'font-size': '14px',
    },
  },
  anchor: {
    textDecoration: 'none',
    extend: {
      transition: 'none',
    },
    hover: {
      textDecoration: 'none',
      extend: {
        transition: 'none',
      },
    },
  },
  heading: {
    weight: 300,
    level: {
      1: {
        small: {
          size: '26px',
          height: '32px',
        },
      },
    },
  },
};

export const LoginTextInput = styled.input`
  padding: 16px;
  font-family: Circular;
  font-size: 16px;
  background-color: #f2f2f2;
  color: #171717;
  border: 0;
  border-radius: 4px;
  box-sizing: border-box;
  width: 100%;
  text-align: center;
`;

// TODO: Fix chrome autocomplete issue!
export const LoginTextInputTemp = styled.input`
  padding: 16px;
  font-family: Circular;
  font-size: 16px;
  background-color: #f2f2f2;
  color: #171717;
  border: 0;
  border-radius: 4px;
  box-sizing: border-box;
  width: 100%;
  text-align: center;
`;

// TODO: Have better solution for form errors!
export const loginErrorTextStyle = {
  position: 'relative',
  height: '0',
  padding: '0',
  top: '16px',
  whiteSpace: 'nowrap',
};

export const THEME_TYPES = {
  PRIMARY: 'PRIMARY',
  SUCCESS: 'SUCCESS',
  INFO: 'INFO',
  WARNING: 'WARNING',
  DANGER: 'DANGER',
};

// TODO: Integrate into ANTD theme
export const COLORS = {
  MAIN: '#222B45',
  PRIMARY: '#3366ff',
  PRIMARY100: '#f2f6ff',
  PRIMARY200: '#d9e4ff',
  PRIMARY300: '#a6c1ff',
  PRIMARY400: '#598bff',
  PRIMARY500: '#3366ff',
  PRIMARY600: '#274bdb',
  PRIMARY700: '#1a34b8',
  PRIMARY800: '#102694',
  PRIMARY900: '#091c7a',
  BASIC: '#3366ff',
  BASIC100: '#ffffff',
  BASIC200: '#f7f9fc',
  BASIC300: '#edf1f7',
  BASIC400: '#e4e9f2',
  BASIC500: '#c5cee0',
  BASIC600: '#8f9bb3',
  BASIC700: '#2e3a59',
  BASIC800: '#222b45',
  BASIC900: '#192038',
  BASIC1000: '#151a30',
  BASIC1100: '#101426',
  INFO: '#a07ada',
  INFO100: '#ebe6f4',
  INFO200: '#ddd0ef',
  INFO300: '#cebaea',
  INFO400: '#bfa4e5',
  INFO500: '#b08fdf',
  INFO600: '#a07ada',
  INFO700: '#8f65d4',
  INFO800: '#7d50ce',
  INFO900: '#693ac8',
  DANGER: '#ff7960',
  DANGER100: '#fde7e7',
  DANGER200: '#ffd2cb',
  DANGER300: '#ffbcaf',
  DANGER400: '#ffa694',
  DANGER500: '#ff907a',
  DANGER600: '#ff7960',
  DANGER700: '#fa5f46',
  DANGER800: '#f4422d',
  DANGER900: '#ed1111',
  SUCCESS: '#00d68f',
  SUCCESS100: '#f0fff5',
  SUCCESS200: '#ccfce3',
  SUCCESS300: '#8cfac7',
  SUCCESS400: '#2ce69b',
  SUCCESS500: '#00d68f',
  SUCCESS600: '#00b887',
  SUCCESS700: '#00997a',
  SUCCESS800: '#007d6c',
  SUCCESS900: '#004a45',
  WARNING: '#ffaa00',
  WARNING100: '#fffdf2',
  WARNING200: '#fff1c2',
  WARNING300: '#ffe59e',
  WARNING400: '#ffc94c',
  WARNING500: '#ffaa00',
  WARNING600: '#db8b00',
  WARNING700: '#b86e00',
  WARNING800: '#945400',
  WARNING900: '#703c00',
};

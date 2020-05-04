import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grommet, Box, Text } from 'grommet';
import Button from './common/Button';
import GrommetTheme from '../utils/theme';
import sideBg from '../assets/sideBg.png';

class EntryContainer extends React.Component {
  _renderSignInSideForm() {
    return (
      <Box
        width="430px"
        round="4px"
        pad={{ horizontal: 'large', top: 'medium', bottom: 'none' }}
        background="#ffffff00"
      >
        <Text textAlign="center" weight="bold" size="xxlarge" color="white">
          Welcome Back!
        </Text>
        <Text
          margin={{ vertical: '30px' }}
          textAlign="center"
          weight="bold"
          size="medium"
          color="white"
        >
          Log in to find market research in seconds
        </Text>
        <Box align="center">
          <Button
            label="Log In"
            variant="ghost"
            onClick={() => this.props.history.push('/login')}
          />
        </Box>
      </Box>
    );
  }

  _renderSignUpSideForm() {
    return (
      <Box
        width="430px"
        round="4px"
        pad={{ horizontal: 'large', top: 'medium', bottom: 'none' }}
        background="#ffffff00"
      >
        <Text textAlign="center" weight="bold" size="xxlarge" color="white">
          Hello there!
        </Text>
        <Text
          margin={{ vertical: '30px' }}
          textAlign="center"
          weight="bold"
          size="medium"
          color="white"
        >
          Sign up to find market research in seconds
        </Text>
        <Box align="center">
          <Button
            label="Sign Up"
            variant="ghost"
            onClick={() => this.props.history.push('/signup')}
          />
        </Box>
      </Box>
    );
  }

  render() {
    const { screen } = this.props;
    return (
      <Grommet theme={GrommetTheme} background="white">
        <Box
          direction={screen === 'signin' ? 'row' : 'row-reverse'}
          background="white"
          wrap
          style={{ minHeight: '100%' }}
        >
          <Box
            direction="column"
            flex={{ grow: 3, shrink: 1 }}
            align="center"
            justify="center"
            pad={{ vertical: 'large' }}
            background="white"
          >
            <Box
              direction="column"
              align="center"
              gap="medium"
              width="429px"
              pad={{ horizontal: '25px', vertical: 'medium' }}
            >
              {this.props.children}
            </Box>
          </Box>
          <Box
            direction="column"
            align="center"
            pad="medium"
            justify="center"
            flex={{ grow: 1, shrink: 3 }}
            background={{ image: `url(${sideBg})`, position: 'right', size: 'cover' }}
          >
            {screen === 'signin' && this._renderSignUpSideForm()}
            {screen === 'signup' && this._renderSignInSideForm()}
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default withRouter(EntryContainer);

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getFrontendVersion } from '../utils/api';
import { init } from '../redux';

const CURRENT_VERSION = '0.0.2';

class Initialize extends React.Component {
  async componentDidMount() {
    const vFE = await getFrontendVersion();
    if (vFE.v === CURRENT_VERSION) {
      this.props.init();
    } else {
      document.location.reload(true);
    }
  }

  render() {
    return <div>Loading...</div>;
  }
}

export default connect(
  () => ({}),
  (dispatch) =>
    bindActionCreators(
      {
        init,
      },
      dispatch,
    ),
)(Initialize);

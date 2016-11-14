import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import { clearCache } from '../../actions/pull-requests';
import { updateSettings } from '../../actions/settings';
import { SettingsType } from '../../models/settings';


const SettingsDialog = (props = {}) => {
  const dialogProps = Object.assign({
    title: '設定',
    modal: false,
  }, props);

  const onBlurDir = (e) => {
    const dir = e.target.value;
    if (props.settings.dir !== dir) {
      props.clearCache({force: true});
    }
    return props.updateSettings({dir});
  };

  return (
    <Dialog {...dialogProps}>
      <TextField
        fullWidth
        name='directory'
        hintText='Target directory'
        floatingLabelText='対象Gitディレクトリ'
        onBlur={onBlurDir}
        defaultValue={props.settings.dir}
      />
      <RaisedButton
        label='PRキャッシュクリア'
        onClick={() => props.clearCache({force: true})}
      />
    </Dialog>
  );
};

SettingsDialog.propTypes = {
  settings: SettingsType.isRequired,
  clearCache: PropTypes.func,
  updateSettings: PropTypes.func,
};

SettingsDialog.defaultProps = {
  clearCache: () => {},
  updateSettings: () => {},
};

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({updateSettings, clearCache}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsDialog);

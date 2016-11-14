import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import VpnKeyIcon from 'material-ui/svg-icons/communication/vpn-key';
import ErrorMessage from '../error_message';

import { getToken } from '../../actions/auth';
import { SettingsType } from '../../models/settings';


class AuthDialog extends Component {
  constructor(props = {}) {
    super(props);
    this.state = {errorMsg: props.errorMsg, focused: false};
    this.onAuth = this.onAuth.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onRequestClose = this.onRequestClose.bind(this);
  }

  componentWillReceiveProps(nextProps = {}) {
    if (this.props.errorMsg !== nextProps.errorMsg) {
      this.setState({errorMsg: nextProps.errorMsg});
    }
    if (nextProps.open && !this.state.focused && !this.focusId) {
      this.focusId = setTimeout(() => {
        this.account && this.account.focus();
        this.focusId = null;
      }, 100);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.focusId);
    this.focusId = null;
  }

  onAuth(e) {
    e.preventDefault();
    const {account, password, twoFactor} = this.state;
    if (account && password) {
      this.props.getToken(account, password, twoFactor);
    }
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      this.onAuth(e);
    }
  }

  onRequestClose() {
    this.setState({errorMsg: '', focused: false});
    this.props.onRequestClose();
  }

  render() {
    const auth = this.props.settings.isAuthorized;
    const dialogProps = {
      title: '認可',
      modal: false,
      style: {width: '500px'},
      open: this.props.open,
      onRequestClose: this.onRequestClose,
    };

    return (
      <Dialog {...dialogProps}>
        {<ErrorMessage message={this.state.errorMsg}/>}
        <TextField
          ref={(node) => this.account = node}
          name='account'
          hintText='Account'
          floatingLabelText='Githubアカウント'
          disabled={auth}
          defaultValue={this.state.account}
          errorText={auth || this.state.account ? null : 'アカウントを入力してください.'}
          onKeyDown={this.onKeyDown}
          onChange={(e) => this.setState({account: e.target.value})}
          onFocus={() => this.setState({focused: true})}
        />
        <TextField
          name='password'
          hintText='Password'
          floatingLabelText='Password'
          disabled={auth}
          defaultValue={this.state.password}
          errorText={auth || this.state.password ? null : 'パスワードを入力してください.'}
          type='password'
          onKeyDown={this.onKeyDown}
          onChange={(e) => this.setState({password: e.target.value})}
        />
        <TextField
          name='two-factor'
          hintText='Two-Factor Code'
          floatingLabelText='２段階認証コード'
          disabled={auth}
          defaultValue={this.state.twoFactor}
          onKeyDown={this.onKeyDown}
          onChange={(e) => this.setState({twoFactor: e.target.value})}
        />
        <RaisedButton
          label={auth ? '認可済み' : '認可'}
          disabled={auth}
          onClick={this.onAuth.bind(this)}
          icon={<VpnKeyIcon/>}
        />
      </Dialog>
    );
  }
}

AuthDialog.propTypes = {
  settings: SettingsType.isRequired,
  errorMsg: PropTypes.string,
  getToken: PropTypes.func,
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

AuthDialog.defaultProps = {
  getToken: () => {},
  onRequestClose: () => {},
};

function mapStateToProps(state) {
  return {
    settings: state.settings,
    errorMsg: state.errors.get('auth'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getToken}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthDialog);

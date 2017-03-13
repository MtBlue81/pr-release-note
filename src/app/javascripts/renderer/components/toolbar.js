import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import VpnKeyIcon from 'material-ui/svg-icons/communication/vpn-key';
import LaunchIcon from 'material-ui/svg-icons/action/launch';
import Snackbar from 'material-ui/Snackbar';

import ExporterDialog from './dialogs/exporter';
import SettingsDialog from './dialogs/settings';
import AuthDialog from './dialogs/auth';
import ErrorMessage from './error_message';

import { fetch } from '../actions/pull-requests';
import { listOfPullRequest } from '../models/pull-request';


class Toolbar extends Component {
  constructor(props = {}) {
    super(props);
    this.state = {fetching: false, errorMsg: props.errorMsg};
    this.onClickFetch = this.onClickFetch.bind(this);
    this.onFetched = this.onFetched.bind(this);
  }

  get totalCount() {
    return this.props.pullRequests.count() || 0;
  }

  get enabledCount() {
    return this.props.pullRequests.filter((pr) => pr.isEnabled).count() || 0;
  }

  componentWillReceiveProps(nextProps = {}) {
    this.setState({errorMsg: nextProps.errorMsg});
  }

  onClickFetch(e) {
    e.preventDefault();
    if (!this.state.fetching) {
      this.setState({fetching: true});
      this.props.fetch().then(this.onFetched, this.onFetched);
    }
  }

  onFetched() {
    this.setState({fetching: false});
  }

  render() {
    const refreshCls = classnames({'refresh-spin': this.state.fetching});
    return (
      <AppBar
        title='Release Note'
        iconElementLeft={<IconButton onClick={this.onClickFetch}><RefreshIcon className={refreshCls}/></IconButton>}
        iconElementRight={(
          <span style={{display: 'flex', alignItems: 'center'}}>
            <span>{``}</span>
            <span style={{color: 'white', marginRight: '10px'}}>{`${this.enabledCount} / ${this.totalCount}`}</span>
            <IconButton onClick={() => this.setState({showExporter: true})}><LaunchIcon color='white'/></IconButton>
            <IconButton onClick={() => this.setState({showAuthMenu: true})}><VpnKeyIcon color={this.props.isAuthorized ? 'green' : 'white'}/></IconButton>
            <IconButton onClick={() => this.setState({showMenu: true})}><MoreVertIcon color='white'/></IconButton>
          </span>
        )}
      >
        <ExporterDialog
          open={!!this.state.showExporter}
          onRequestClose={() => this.setState({showExporter: false, errorMsg: ''})}
          pullRequests={this.props.pullRequests}
        />
        <SettingsDialog
          open={!!this.state.showMenu}
          onRequestClose={() => this.setState({showMenu: false, errorMsg: ''})}
        />
        <AuthDialog
          open={!!this.state.showAuthMenu}
          onRequestClose={() => this.setState({showAuthMenu: false, errorMsg: ''})}
        />
        <Snackbar
          open={!!this.state.errorMsg}
          message={<ErrorMessage message={this.state.errorMsg} style={{height: '45px'}}/>}
          autoHideDuration={4000}
          onRequestClose={() => this.setState({errorMsg: ''})}
        />
      </AppBar>
    );
  }
}

Toolbar.propTypes = {
  pullRequests: listOfPullRequest.isRequired,
  isAuthorized: PropTypes.bool,
  errorMsg: PropTypes.string,
  fetch: PropTypes.func,
};

Toolbar.defaultProps = {
  fetch: () => {},
};

function mapStateToProps(state = {}) {
  return {
    isAuthorized: state.settings.isAuthorized,
    errorMsg: state.errors.get('message'),
    pullRequests: state.pullRequests,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetch}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);

import React, { Component, PropTypes } from 'react';
import { List } from 'material-ui/List';
import PrListItem from './pr-list-item';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateStatus } from '../actions/pull-requests';
import { listOfPullRequest } from '../models/pull-request';

export class PrList extends Component {
  constructor() {
    super();
    this.onRequestUpdateStatus = this.onRequestUpdateStatus.bind(this);
  }

  onRequestUpdateStatus(pr, status) {
    this.props.updateStatus(pr.number, status);
  }

  render() {
    return (
      <section>
        <List>
          {
            this.props.pullRequests.sort((pr) => pr.number).map(
              (pr, idx) => <PrListItem pullRequest={pr} key={idx} onRequestUpdateStatus={this.onRequestUpdateStatus}/>
            )
          }
        </List>
      </section>
    );
  }
}

PrList.propTypes = {
  pullRequests: listOfPullRequest.isRequired,
  updateStatus: PropTypes.func,
};

PrList.defaultProps = {
  updateStatus: () => {},
};

function mapStateToProps(state) {
  return {
    pullRequests: state.pullRequests,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({updateStatus}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrList);

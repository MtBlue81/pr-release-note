import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import { listOfPullRequest } from '../../models/pull-request';

// TODO ラベルを利用してグルーピング
export default class ExporterDialog extends Component {
  get note() {
    return this.props.pullRequests
      .filter((pr) => pr.isEnabled)
      .map((pr) => `- [ ] #${pr.number} ${pr.title} @${pr.author}`);
  }

  render() {
    const dialogProps = Object.assign({
      title: 'リリースノート',
      modal: false,
      autoScrollBodyContent: true,
    }, this.props);

    return (
      <Dialog {...dialogProps}>
        <TextField name="note" fullWidth multiLine defaultValue={this.note.join('\n')}/>
      </Dialog>
    );
  }
}

ExporterDialog.propTypes = {
  pullRequests: listOfPullRequest.isRequired,
};

import React, { Component } from 'react';
import { Map, List } from 'immutable';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import { listOfPullRequest } from '../../models/pull-request';

const GROUPS = {
  bug: 'バグ修正',
  feature: '新機能',
  enhancement: '改善',
  refactoring: 'リファクタリング',
  other: 'その他',
};
const GROUP_KEYS = Object.keys(GROUPS);
const initData = GROUP_KEYS.reduce((ret, key) => ret.set(key, List()), Map())

export default class ExporterDialog extends Component {
  get note() {
    return this.props.pullRequests
      .filter((pr) => pr.isEnabled)
      .reduce((ret, pr) => {
        const group = pr.labels.find((label) => GROUP_KEYS.indexOf(label) !== -1) || 'other';
        return ret.update(group, (list) => list.push(pr));
      }, initData)
      .reduce((ret, prs, key) => {
        if (prs.count() === 0) { return ret; }
        return ret
          .concat(`### ${GROUPS[key]}`)
          .concat(prs.map((pr) => `- [ ] #${pr.number} ${pr.title} @${pr.author}`));
      }, List());
  }

  render() {
    const dialogProps = Object.assign({
      title: 'リリースノート',
      modal: false,
      autoScrollBodyContent: true,
    }, this.props);

    return (
      <Dialog {...dialogProps}>
        <TextField name="note" fullWidth multiLine defaultValue={this.note.toJS().join('\n')}/>
      </Dialog>
    );
  }
}

ExporterDialog.propTypes = {
  pullRequests: listOfPullRequest.isRequired,
};

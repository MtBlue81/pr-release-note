import React, { Component, PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { shell } from 'electron';
import { STATUS_ENABLED, STATUS_DISABLED, PullRequestType } from '../models/pull-request';

export default class PrListItem extends Component {

  constructor() {
    super();
    this.onToggle = this.onToggle.bind(this);
    this.onClickNumber = this.onClickNumber.bind(this);
    this.onClickAuthor = this.onClickAuthor.bind(this);
  }

  onClickNumber(e) {
    e.preventDefault();
    shell.openExternal(e.target.href);
  }

  onClickAuthor(e) {
    e.preventDefault();
    const url = `https://github.com/${this.props.pullRequest.author}`;
    shell.openExternal(url);
  }

  onToggle() {
    const pr = this.props.pullRequest;
    this.props.onRequestUpdateStatus(pr, pr.isEnabled ? STATUS_DISABLED : STATUS_ENABLED);
  }

  render() {
    const pr = this.props.pullRequest;
    const primaryText = (
      <div className='pr-main-contents'>
        <Avatar src={pr.avatarUrl} onClick={this.onClickAuthor}/>
        <a href={pr.url} onClick={this.onClickNumber}>{`#${pr.number}`}</a>
        <span style={{flexGrow: 1}}>{pr.title}</span>
        <div style={{display: 'flex' }}>
          {
            pr.labels.map((label, idx) => {
              return <Chip onClick={(e) => e.preventDefault()} style={{margin: '0 5px'}} key={idx}>{label}</Chip>;
            })
          }
        </div>
      </div>
    );
    const listProps = {
      primaryText,
      style: {
        padding: '8px 16px 8px 56px',
      },
      leftCheckbox: <Checkbox style={{top: '30%'}} onCheck={this.onToggle} checked={pr.isEnabled}/>,
    };

    return <ListItem {...listProps}/>;
  }
}

PrListItem.propTypes = {
  pullRequest: PullRequestType.isRequired,
  onRequestUpdateStatus: PropTypes.func,
};

PrListItem.defaultProps = {
  onRequestUpdateStatus: () => {},
};


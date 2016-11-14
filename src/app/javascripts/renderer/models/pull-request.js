import { Record, fromJS } from 'immutable';
import { PropTypes } from 'react';
import { listOf } from 'react-immutable-proptypes';

export const STATUS_ENABLED  = 'enabled';
export const STATUS_DISABLED = 'disabled';

const {
  number,
  oneOf,
  shape,
  string,
} = PropTypes;

export const PullRequestType = shape({
  number: number.isRequired,
  title: string.isRequired,
  author: string,
  avatarUrl: string,
  url: string,
  status: oneOf([STATUS_DISABLED, STATUS_ENABLED]),
  state: string,
  labels: listOf(string),
  group: string,
  body: string,
  mergedAt: string,
  updatedAt: string,
  createdAt: string,
});

export const listOfPullRequest = listOf(PullRequestType);

const defaultValues = {
  number: '',
  title: '',
  author: '',
  avatarUrl: '',
  url: '',
  status: STATUS_ENABLED,
  state: '', // githubのステータス
  labels: [],
  group: '',
  body: '',
  mergedAt: '',
  updatedAt: '',
  createdAt: '',
};

export default class PullRequest extends Record(defaultValues) {
  constructor(args) {
    super(fromJS(args));
  }

  get isEnabled() {
    return this.status === STATUS_ENABLED;
  }
  get isDisabled() {
    return this.status === STATUS_DISABLED;
  }
}

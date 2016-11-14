import { Record } from 'immutable';
import { PropTypes } from 'react';

const {
  number,
  shape,
  string,
  } = PropTypes;

export const SettingsType = shape({
  dir: string,
  productionBranch: string,
  stagingBranch: string,
  maxBuffer: number,
  repository: string,
  token: string,
});

const defaultValues = {
  dir: '',
  productionBranch: 'master',
  stagingBranch: 'develop',
  maxBuffer: 2000*1024,
  repository: '',
  token: '',
};

export default class Settings extends Record(defaultValues) {
  get isAuthorized() {
    return !!this.token;
  }
}

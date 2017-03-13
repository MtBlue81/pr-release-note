import { UPDATE_SETTINGS } from '../reducers/settings';

export function updateSettings(settings = {}) {
  return (dispatch, _getState) => {
    return dispatch(UPDATE_SETTINGS(settings));
  }
}

import { UPDATE_SETTINGS } from '../reducers/settings';

export function updateSettings(settings = {}) {
  return (dispatch, getState) => {
    const currentSettings = getState().settings;
    if (settings.dir && settings.dir !== currentSettings.dir) {
      settings.repository = ''; // clear
    }
    return dispatch(UPDATE_SETTINGS(settings));
  }
}

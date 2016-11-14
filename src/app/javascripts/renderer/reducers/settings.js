import { createAction, handleActions } from 'redux-actions';
import Settings from '../models/settings';

export const UPDATE_SETTINGS = createAction('UPDATE_SETTINGS', (payload) => payload);
const storageKey = 'pr-release-note:settings';

const initialState = new Settings(JSON.parse(localStorage.getItem(storageKey)));

export const handlers = {
  UPDATE_SETTINGS: (state, { payload }) => {
    const nextState = Object.keys(payload).reduce((state, key) => state.set(key, payload[key]), state);
    localStorage.setItem(storageKey, JSON.stringify(nextState.toJS()));
    return nextState;
  },
};

export default handleActions(handlers, initialState);

import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';
import PullRequest from '../models/pull-request';

export const UPDATE_PREV_RELEASE  = createAction('UPDATE_PREV_RELEASE', (payload) => payload);
const storageKey = 'pr-release-note:release';
const initialState = Map({previous: getStoredValue()});

function getStoredValue() {
  return new PullRequest(JSON.parse(localStorage.getItem(storageKey)) || {});
}

export const handlers = {
  UPDATE_PREV_RELEASE: (state, { payload }) => {
    localStorage.setItem(storageKey, JSON.stringify(payload));
    return state.set('previous', new PullRequest(payload));
  },
};

export default handleActions(handlers, initialState);

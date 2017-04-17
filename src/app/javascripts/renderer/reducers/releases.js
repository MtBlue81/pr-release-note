import { createAction, handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';
import PullRequest from '../models/pull-request';

export const UPDATE_PREV_RELEASE  = createAction('UPDATE_PREV_RELEASE', (payload) => payload);
const storageKey = 'pr-release-note:release';
const initialState = Map({previous: getStoredValue()});

function getStoredValue() {
  return new PullRequest(fromJS(JSON.parse(localStorage.getItem(storageKey)) || {}));
}

export const handlers = {
  CLEAR_PR_CACHE: (state) => {
    localStorage.removeItem(storageKey);
    return state;
  },
  UPDATE_PREV_RELEASE: (state, { payload }) => {
    localStorage.setItem(storageKey, JSON.stringify(payload));
    return state.set('previous', new PullRequest(payload));
  },
};

export default handleActions(handlers, initialState);

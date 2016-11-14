import { createAction, handleActions } from 'redux-actions';
import { List } from 'immutable';
import PullRequest from '../models/pull-request';

export const UPDATE_PULL_REQUESTS = createAction('UPDATE_PULL_REQUESTS', (payload) => payload);
export const UPDATE_PULL_REQUEST  = createAction('UPDATE_PULL_REQUEST', (payload) => payload);
export const CLEAR_PR_CACHE       = createAction('CLEAR_PR_CACHE', (payload) => payload);
const storageKey = 'pr-release-note:pull-requests';
const expireKey = `${storageKey}:expire`;
const expireDate = 2;

const initialState = List((JSON.parse(localStorage.getItem(storageKey)) || []).map((params) => new PullRequest(params)));

function saveAfter(fn) {
  return (...args) => {
    const nextState = fn(...args);
    const now = new Date();
    localStorage.setItem(storageKey, JSON.stringify(nextState.toJS()));
    localStorage.setItem(expireKey, now.setDate(now.getDate() + expireDate));
    return nextState;
  };
}

export const handlers = {
  CLEAR_PR_CACHE: (state, { payload }) => {
    if (!payload.force) {
      const expire = localStorage.getItem(`${storageKey}:expire`);
      if (!expire || expire > Date.now()) {
        return state;
      }
    }
    localStorage.removeItem(storageKey);
    localStorage.removeItem(expireKey);
    return List();
  },
  UPDATE_PULL_REQUESTS: saveAfter(
    (state, { payload }) => {
      const hasPrs = state.map((pr) => pr.number);
      return state.concat(
        payload.prs
          .filter((params) => !hasPrs.includes(params.number))
          .map((params) => new PullRequest(params))
      );
    }
  ),
  UPDATE_PULL_REQUEST: saveAfter(
    (state, { payload }) => {
      return state.update(
        state.findIndex((pr) => pr.number === payload.number),
        (pr) => pr.set('status', payload.status)
      );
    }
  ),
};

export default handleActions(handlers, initialState);

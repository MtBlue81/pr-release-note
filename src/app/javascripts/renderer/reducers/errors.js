import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

export const SHOW_ERROR  = createAction('SHOW_ERROR', (payload) => payload);
export const CLEAR_ERROR = createAction('CLEAR_ERROR', (payload) => payload);

/**
 * {
 *   message: エラーメッセージ
 *   [field]: 適宜フィールドごとのメッセージ
 * }
 */
const initialState = Map();

const handlers = {
  SHOW_ERROR: (state, { payload = {} }) => state.set(payload.field, payload.message).set('message', payload.message),
  CLEAR_ERROR: () => Map(),
};

export default handleActions(handlers, initialState);

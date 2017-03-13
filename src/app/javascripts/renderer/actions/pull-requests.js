import { getPreviousReleasePr, fetchPullRequests, fetchLabels } from '../services/github';
import { UPDATE_PREV_RELEASE } from '../reducers/releases';
import { UPDATE_SETTINGS } from '../reducers/settings';
import { UPDATE_PULL_REQUESTS, UPDATE_PULL_REQUEST, CLEAR_PR_CACHE } from '../reducers/pull-requests';
import { SHOW_ERROR, CLEAR_ERROR } from '../reducers/errors';

export function fetch() {
  return (dispatch, getState) => {
    const settings = getState().settings;
    let page = 1;
    let previousPr;

    dispatch(CLEAR_ERROR());
    return getPreviousReleasePr(settings)
      .then((pr) => {
        previousPr = pr;
        dispatch(UPDATE_PREV_RELEASE(previousPr));
        return fetchPullRequests(previousPr, page, settings);
      })
      .then((prs) => afterResponse(prs, previousPr, ++page, settings, dispatch))
      .catch((e) => {
        dispatch(SHOW_ERROR({field: 'common', message: e.message || e}));
      });
  };
}
function afterResponse(prs, previousPr, page, settings, dispatch) {
  dispatch(UPDATE_PULL_REQUESTS({prs}));
  fetchLabels(prs.map((pr) => pr.number), settings).then((prs) => UPDATE_PULL_REQUEST({prs}));
  if (prs.length === 0) { return Promise.resolve(); }
  return fetchPullRequests(previousPr, page, settings)
    .then((prs) => afterResponse(prs, previousPr, ++page, settings, dispatch));
}

export function updateStatus(number, status) {
  return (dispatch) => {
    dispatch(CLEAR_ERROR());
    dispatch(UPDATE_PULL_REQUEST({number, status}));
  };
}

export function clearCache(options) {
  return (dispatch) => {
    dispatch(CLEAR_ERROR());
    dispatch(CLEAR_PR_CACHE(options));
  };
}

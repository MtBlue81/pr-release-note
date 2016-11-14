import { git as execGit, getRepositoryName, getMergedCommits, searchPullRequestIds } from '../services/git';
import { fetchPullRequests } from '../services/github';
import { UPDATE_SETTINGS } from '../reducers/settings';
import { UPDATE_PULL_REQUESTS, UPDATE_PULL_REQUEST, CLEAR_PR_CACHE } from '../reducers/pull-requests';
import { SHOW_ERROR, CLEAR_ERROR } from '../reducers/errors';

export function fetchTargetPr() {
  return (dispatch, getState) => {
    const settings = getState().settings;
    let currentRepository = settings.repository;
    const getCurrentSetting = () => settings.set('repository', currentRepository);

    dispatch(CLEAR_ERROR());
    return execGit(settings, 'remote', 'update', 'origin')
      .then(() => getRepositoryName(settings))
      .then((repository) => {
        currentRepository = repository;
        dispatch(UPDATE_SETTINGS({repository}))
      })
      .then(() => getMergedCommits(getCurrentSetting()))
      .then((featureSha1s) => searchPullRequestIds(featureSha1s, getCurrentSetting()))
      .then((idList) => fetchPullRequests(idList, getCurrentSetting()))
      .then((prs) => dispatch(UPDATE_PULL_REQUESTS({prs})))
      .catch((e) => {
        dispatch(SHOW_ERROR({field: 'common', message: e.message || e}));
        throw(e);
      });
  };
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

import axios from 'axios';
// import github from 'github'; // https://github.com/mikedeboer/node-github/issues/328

const GITHUB_HOST = 'https://api.github.com';

export function fetchPullRequests(numberList, settings) {
  if (!settings.token) {
    return Promise.reject('Githubの認可が必要です.')
  }
  return Promise.all(numberList.map((number) => {
    return axios.get(`${GITHUB_HOST}/repos/${settings.repository}/issues/${number}`, {
      params: { access_token: settings.token },
    });
  })).then((responses) => responses.map((res) => pick(res.data)));
}

function pick(pr) {
  const author = pr.assignee ? pr.assignee : pr.user;
  return {
    number: pr.number,
    title: pr.title,
    author: author.login,
    avatarUrl: author.avatar_url,
    mergedAt: pr.merged_at,
    updatedAt: pr.updated_at,
    createdAt: pr.created_at,
    url: pr.html_url,
    state: pr.state,
    body: pr.body,
    labels: pr.labels.map((l) => l.name),
  };
}

export function authorization(username, password, headers = {}) {
  return axios.post(
      `${GITHUB_HOST}/authorizations`, {
        scopes: ['public_repo', 'repo'], note: 'pr-release-note',
      }, {
        auth: {
          username, password,
        },
        headers,
      }
    );
}

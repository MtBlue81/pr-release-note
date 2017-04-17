import axios from 'axios';

const GITHUB_HOST = 'https://api.github.com';

export function getPreviousReleasePr(settings) {
  if (!settings.token) {
    return Promise.reject('Githubの認可が必要です.')
  }
  return axios.get(`${GITHUB_HOST}/repos/${settings.repository}/pulls`, {
    params: { access_token: settings.token, state: 'closed', base: 'master' },
  }).then((prs) => {
    if (!prs || !prs.data || prs.data.length === 0) {
      console.info('no previous release pr.');
      return;
    }
    return prs.data[0];
  });
}

export function fetchPullRequests(previousPr, page, settings) {
  if (!settings.token) {
    return Promise.reject('Githubの認可が必要です.')
  }
  const from = previousPr ? new Date(previousPr.created_at) : 0;
  return axios.get(`${GITHUB_HOST}/repos/${settings.repository}/pulls`, {
    params: { access_token: settings.token, state: 'closed', base: 'develop', page },
  })
    .then((responses) => responses.data.map((data) => pick(data)))
    .then((prs) => prs.filter((pr) => new Date(pr.mergedAt) > from))
}

export function fetchLabels(numberList, settings) {
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
    labels: pr.labels ? pr.labels.map((l) => l.name) : [],
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

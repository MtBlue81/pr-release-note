import {exec} from 'child_process';
import url from 'url';

const RETURN_CHAR = '\n';

export function git(settings, ...args) {
  return execGit.call(settings, ...args);
}

export function getRepositoryName(settings) {
  if (settings.repository) {
    return Promise.resolve(settings.repository);
  }
  return git(settings, 'config', 'remote.origin.url').then((data) => {
    let remote = data;
    if (!remote.match(/^\w+:\/\//)) {
      remote = `ssh://${remote.replace(':', '/')}`;
    }
    const remoteUrl = url.parse(remote);
    return remoteUrl.path.replace(/^\//, '').replace(/\.git$/, '');
  });
}

export function getMergedCommits(settings) {
  return git(settings,
    'log', '--merges', '--pretty=format:%P', `origin/${settings.productionBranch}..origin/${settings.stagingBranch}`
  ).then((data) => data.split(RETURN_CHAR).map((sha1) => sha1.split(' ')[1]));
}

export function searchPullRequestIds(featureSha1s, settings) {
  return git(settings,
    'ls-remote', 'origin', '"refs/pull/*/head"'
  ).then((data) => {
    return data.split(RETURN_CHAR).reduce((memo, commit) => {
      if (!commit) {
        return memo; 
      }
      const [_, sha1, ref] = commit.match(/^(.*)\s+(.*)$/); // eslint-disable-line
      if (featureSha1s.includes(sha1)) {
        const [__, prNum] = ref.match(/^refs\/pull\/(\d+)\/head$/); // eslint-disable-line
        memo.push(prNum);
      }
      return memo;
    }, []);
  });
}

function execGit(...args) {
  const cmd = args.join(' ');
  if (!this.dir) {
    return Promise.reject('ディレクトリを指定してください.');
  }
  return new Promise((resolve, reject) => {
    exec(
      `pushd ${this.dir} >/dev/null 2>&1;git ${cmd};popd >/dev/null 2>&1`,
      {maxBuffer: this.maxBuffer},
      (error, stdout, stderr = '') => {
        if (error || stderr.match(/^fatal/)) {
          reject(error || stderr);
          return;
        }
        if (stderr) {
          console.warn(stderr);
        }
        resolve(stdout);
      }
    );
  });
}

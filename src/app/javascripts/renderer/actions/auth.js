import { authorization } from '../services/github';
import { UPDATE_SETTINGS } from '../reducers/settings';
import { SHOW_ERROR, CLEAR_ERROR } from '../reducers/errors';

export function getToken(username, password, twoFactor) {
  return (dispatch) => {
    dispatch(CLEAR_ERROR());
    return authorization(username, password, twoFactor ? {'X-GitHub-OTP': twoFactor} : null)
      .then((response) => dispatch(UPDATE_SETTINGS({token: response.data.token})))
      .catch((e) => {
        let message = '認可に失敗しました。';
        if (isOtpRequired(e.response)) {
          message = '２段階認証が必要です。';
        }
        if (isTokenExist(e.response)) {
          message = 'Tokenが存在します。';
        }
        dispatch(SHOW_ERROR({field: 'auth', message}));
        throw(e);
      });
  };
}

function isTokenExist(response) {
  const errors = response && response.data && response.data.errors;
  if (errors) {
    return errors.some((error = {}) => error.code === 'already_exists');
  }
}

function isOtpRequired(response) {
  return response && response.headers['x-github-otp'] && response.headers['x-github-otp'].includes('required');
}


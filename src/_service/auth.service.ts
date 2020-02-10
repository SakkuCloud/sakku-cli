// External Modules
import axios from 'axios';

// Project Modules
import { login_url, overview_url, user_pass_login_url } from '../consts/urls';
import IServerResult from '../interfaces/server-result.interface';
import { IOverview } from '../interfaces/user.interface';
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';

export const authService = {
  authenticate,
  overview,
  login
};

function login(auth: { username: string, password: string }) {
  const crypto = require('crypto');
  auth.password = crypto.createHash('md5').update(auth.password).digest('hex');
  return axios.post<IServerResult<string>>(user_pass_login_url, { email: auth.username, password: auth.password })
    .catch((error) => {
      throw common.handleRequestError(error, true);
    });
}

function authenticate(code: string) {
  return axios.post(login_url, { code })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function overview(ctx: any) {
  return axios.get<IServerResult<IOverview>>(overview_url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getHeader(ctx: any) {
  return { Authorization: readToken(ctx) };
}

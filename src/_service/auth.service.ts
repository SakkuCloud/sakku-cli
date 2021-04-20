// External Modules
import axios from 'axios';
import Command from '@oclif/command';

// Project Modules
import { sakku_zone_url, login_url, overview_url, user_pass_login_url } from '../consts/urls';
import IServerResult from '../interfaces/server-result.interface';
import { IOverview } from '../interfaces/user.interface';
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';
import { getBaseUrl } from '../utils/get-urls-based-zone';
import { IZoneInfo } from '../interfaces/auth.interface';

export const authService = {
  authenticate,
  overview,
  login,
  getZoneInfo,
};

function getZoneInfo() {
  let url = sakku_zone_url;

  return axios.get<IServerResult<IZoneInfo[]>>(url, { headers: {'Accept-Language':'en'} })
    .catch((error) => {
      throw common.handleRequestError(error, true);
    });
}

function login(ctx: Command, auth: { username: string, password: string }) {
  let url = getBaseUrl(ctx) + user_pass_login_url ;
  const crypto = require('crypto');
  auth.password = crypto.createHash('md5').update(auth.password).digest('hex');
  return axios.post<IServerResult<string>>(url, { email: auth.username, password: auth.password })
    .catch((error) => {
      throw common.handleRequestError(error, true);
    });
}

function authenticate(ctx:Command, code: string) { 
  let url = getBaseUrl(ctx) + login_url;
  return axios.post(url, { code })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}
  
function overview(ctx: any) {
  let url = getBaseUrl(ctx) + overview_url;
  return axios.get<IServerResult<IOverview>>(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getHeader(ctx: any) {
  return { Authorization: readToken(ctx) };
}

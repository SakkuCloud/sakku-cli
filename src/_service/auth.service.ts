import axios from 'axios'

import {login_url, overview_url} from '../consts/urls'
import IServerResult from '../interfaces/server-result.interface'
import {IOverview} from '../interfaces/user.interface'
import {readToken} from '../utils/read-token'

export const authService = {
  authenticate,
  overview
}

function authenticate(code: string) {
  return axios.post(login_url, {code})
}

function overview(ctx: any) {
  return axios.get<IServerResult<IOverview>>(overview_url, {headers: getHeader(ctx)})
}

function getHeader(ctx: any) {
  return {Authorization: readToken(ctx)}
}

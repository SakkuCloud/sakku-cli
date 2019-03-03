import axios from 'axios'

import {login_url, overview_url} from '../consts/urls'
import reader from '../utils/reader'

export const authService = {
  authenticate,
  overview
}

function authenticate(code: string) {
  return axios.post(login_url, {code})
}

function overview(ctx: any) {
  return axios.get(overview_url, {headers: getHeader(ctx)})
}

function getHeader(ctx: any) {
  return {Authorization: reader(ctx)}
}

import {Command} from '@oclif/command'
import axios from 'axios'

import {app_url} from '../consts/urls'
import {IApp} from '../interfaces/app.interface'
import IServerResult from '../interfaces/server-result.interface'
import {readToken} from '../utils/read-token'

export const appService = {
  create,
  list
}

function create(ctx: Command, data: {}) {
  return axios.post(app_url, data , {headers: getHeader(ctx)})
}

function list(ctx: Command, page = 1, data: IApp[] = []): Promise<IApp[]> {
  return new Promise((accept, reject) => axios.get<IServerResult<IApp[]>>(app_url, {headers: getHeader(ctx), params: {
    page,
    size: 15
  }}).then(res => {
    if (res && res.data && !res.data.error && res.data.result) {
      data.push(...res.data.result)
      accept(res.data.result.length > 0 ? list(ctx, page + 1, data) : data)
    } else {
      reject(res)
    }
  }).catch(err => reject(err)))
}

function getHeader(ctx: Command) {
  return {Authorization: readToken(ctx)}
}

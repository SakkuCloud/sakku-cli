import {Command} from '@oclif/command'
import axios from 'axios'

import {app_url} from '../consts/urls'
import {readToken} from '../utils/read-token'

export const execService = {
  create
}

function create(ctx: Command, data: {}) {
  return axios.post(app_url, data , {headers: getHeader(ctx)})
}

function getHeader(ctx: Command) {
  return {Authorization: readToken(ctx)}
}

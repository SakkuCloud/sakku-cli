import {Command} from '@oclif/command'
import axios from 'axios'

import {readToken} from '../utils/read-token'

export const execService = {
  create
}

function create(ctx: Command, data: {}, host: string, cid: string) {
  return axios.post(host + '/containers/' + cid + '/exec', data, {headers: getHeader(ctx)})
    .then(value => value.data.Id)
}

function getHeader(ctx: Command) {
  return {Authorization: readToken(ctx)}
}

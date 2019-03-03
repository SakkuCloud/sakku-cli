import axios from 'axios'

import {create_app_url} from '../consts/urls'
import reader from '../utils/reader'

export const appService = {
  create
}

function create(ctx: any, data: {}) {
  return axios.post(create_app_url, data , {headers: getHeader(ctx)})
}

function getHeader(ctx: any) {
  return {Authorization: reader(ctx)}
}

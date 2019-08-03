import {Command} from '@oclif/command';
import axios from 'axios';

import {readToken} from '../utils/read-token';

export const catalogService = {
  create,
  exec
};

function create(ctx: Command, data: {}, host: string, cid: string) {
  return axios.post(host + '/containers/' + cid + '/exec', data, {headers: getHeader(ctx)})
    .then(value => value.data.Id);
}

function exec(ctx: Command, id: string, host: string, data: {}) {
  return axios.post(host + `/exec/${id}/start`,
    data, {responseType: 'stream'});
}

function getHeader(ctx: Command) {
  return {Authorization: readToken(ctx)};
}

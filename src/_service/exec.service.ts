// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';

// Project Modules
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';


export const execService = {
  create,
  exec
};

function create(ctx: Command, data: {}, host: string, cid: string) {
  return axios.post(host + '/containers/' + cid + '/exec', data, { headers: getHeader(ctx) })
    .then(value => value.data.Id)
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function exec(ctx: Command, id: string, host: string, data: {}) {
  return axios.post(host + `/exec/${id}/start`,
    data, { responseType: 'stream' })
    .catch((error) => {
      throw common.handleRequestError(error);
    });;
}

function getHeader(ctx: Command) {
  return { Authorization: readToken(ctx) };
}

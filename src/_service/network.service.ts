// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';

// Project Modules
import { app_network_url} from '../consts/urls';
import { IApp, IAppVO } from '../interfaces/app.interface';
import IServerResult from '../interfaces/server-result.interface';
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';

export const networkService = {
  create,
  addApp,
  all,
  rm,
  rmApp,
};

function create(ctx: Command, data: {}) {
  return axios.post(app_network_url +'create', null, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function addApp(ctx: Command, networkName: string, data: {}) {
  return axios.post(app_network_url + networkName + '/addApp', {}, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function rmApp(ctx: Command, networkName: string, data: {}) {
  return axios.post(app_network_url + networkName + '/removeApp', {}, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function all(ctx: Command) {
  return axios.get<IServerResult<IAppVO>>(app_network_url , { headers: getHeader(ctx) }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function rm(ctx: Command, networkName: string, data: {}) {
  return axios.delete(app_network_url + networkName, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getHeader(ctx: Command) {
  return { Authorization: readToken(ctx) };
}

function getToken(ctx: Command) {
  return readToken(ctx).split(' ')[1];
}
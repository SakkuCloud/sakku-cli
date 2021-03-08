// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';

// Project Modules
import { app_network_url } from '../consts/urls';
import { IAppVO } from '../interfaces/app.interface';
import IServerResult from '../interfaces/server-result.interface';
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';
import { getBaseUrl } from '../utils/get-urls-based-zone';

export const networkService = {
  all,
  create,
  addApp,
  rm,
  rmApp,
};


function all(ctx: Command) {
  let url = getBaseUrl(ctx) + app_network_url;
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx) }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function create(ctx: Command, data: {}) {
  let url = getBaseUrl(ctx) + app_network_url + 'create';
  return axios.post(url, {}, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function addApp(ctx: Command, networkName: string, data: {}) {
  let url = getBaseUrl(ctx) + app_network_url + networkName + '/addApp';
  return axios.post(url, {}, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function rm(ctx: Command, networkName: string, data: {}) {
  let url = getBaseUrl(ctx) + app_network_url + networkName;
  return axios.delete(url, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function rmApp(ctx: Command, networkName: string, data: {}) {
  let url = getBaseUrl(ctx) + app_network_url + networkName + '/removeApp';
  return axios.post(url, {}, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getHeader(ctx: Command) {
  return { Authorization: readToken(ctx) };
}
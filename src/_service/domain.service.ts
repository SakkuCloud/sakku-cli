// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';

// Project Modules
import { domain_url, domain_app_url, domain_record_url } from '../consts/urls';
import { IAppVO } from '../interfaces/app.interface';
import IServerResult from '../interfaces/server-result.interface';
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';
import { getBaseUrl } from '../utils/get-urls-based-zone';

export const domainService = {
  all,
  app,
  add,
  rm,
  getAllRecord,
  addRecord,
  updateRecord,
  rmRecord
};

function add(ctx: Command, appId: number, data: {}) {
  let url = getBaseUrl(ctx) + domain_app_url + appId + '/addDomain';
  return axios.post(url, {}, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function all(ctx: Command) {
  let url = getBaseUrl(ctx) + domain_url;
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx) }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function app(ctx: Command, appId: string) {
  let url = getBaseUrl(ctx) + domain_app_url + appId;
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function rm(ctx: Command, appId: number, data: {}) {
  let url = getBaseUrl(ctx) + domain_app_url + appId;
  return axios.delete(url, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getAllRecord(ctx: Command, domain: String) {
  let url = getBaseUrl(ctx) + domain_record_url;
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx) , params: {domain}}).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function addRecord(ctx: Command, domain: string, data: {}) {
  let url = getBaseUrl(ctx) + domain_record_url;
  return axios.post(url, data, { headers: getHeader(ctx) , params: {domain}})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function updateRecord(ctx: Command, domain: string, name: string, type: string, data: {}) {
  let url = getBaseUrl(ctx) + domain_record_url;
  return axios.put(url, data, { headers: getHeader(ctx) , params: {domain, name, type}})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function rmRecord(ctx: Command, data: {}) {
  let url = getBaseUrl(ctx) + domain_record_url;
  return axios.delete(url, { headers: getHeader(ctx) , params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getHeader(ctx: Command) {
  return { Authorization: readToken(ctx) };
}
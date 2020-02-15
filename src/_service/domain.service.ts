// Native Modules
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';
const request = require('request');
const mkdirp = require('mkdirp-promise')
const mime = require('mime');
const q = require('q');
const readFile = util.promisify(fs.readFile);

// Project Modules
import { domain_url, domain_app_url } from '../consts/urls';
import { IApp, IAppVO } from '../interfaces/app.interface';
import IServerResult from '../interfaces/server-result.interface';
import { readLocalApps } from '../utils/read-from-file';
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';
import { start } from 'repl';

export const domainService = {
  getAll,
  add,
  getByApp,
  rm,
};

function add(ctx: Command, data: {}) {
  return axios.post(domain_app_url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getAll(ctx: Command) {
  return axios.get<IServerResult<IAppVO>>(domain_url , { headers: getHeader(ctx) }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getByApp(ctx: Command, appId: string) {
  return axios.get<IServerResult<IAppVO>>(domain_app_url + appId, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function rm(ctx: Command, appId: string) {
  return axios.delete(domain_app_url + appId, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });;
}

function getHeader(ctx: Command) {
  return { Authorization: readToken(ctx) };
}

function getToken(ctx: Command) {
  return readToken(ctx).split(' ')[1];
}




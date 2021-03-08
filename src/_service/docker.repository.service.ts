// Native Modules
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';
const request = require('request');
const mime = require('mime');
const q = require('q');

// Project Modules
import { docker_repository_url } from '../consts/urls';
import { readToken } from '../utils/read-token';
import IServerResult from '../interfaces/server-result.interface';
import { IAppVO } from '../interfaces/app.interface';
import { common } from '../utils/common';
import { getBaseUrl } from '../utils/get-urls-based-zone';

export const dockerRepositoryService = {
  build,
  ps,
  share,
  getRepoInfo
};

function build(ctx: any, fullPath: string, settings: { name: string, tag: string, dockerFile: string , buildArgs: string}) {
  console.log(fullPath);
  let defer = q.defer();
  let url = getBaseUrl(ctx) + docker_repository_url + 'build';
  let ext = path.extname(fullPath);
  let fileName = path.basename(fullPath);
  let mimeType = mime.getType(fullPath);
  let settings_string = JSON.stringify(settings);
  let headers = {
    "Content-Type": "multipart/form-data"
  };

  var options = {
    'method': 'POST',
    'url': url,
    'headers': Object.assign(getHeader(ctx), headers),
    formData: {
      'file': {
        'value': fs.createReadStream(fullPath),
        'options': {
          'filename': fileName,
          'contentType': mimeType
        }
      },
      settings_string
    }
  };

  request(options, function (error: any, response: { body: any; }) {
    if (error) {
      defer.reject(error);
    }
    else {
      defer.resolve(response.body);
    }
  });

  return defer.promise;
}

function ps(ctx: Command) {
  let url = getBaseUrl(ctx) + docker_repository_url;
  return axios.get<IServerResult<IAppVO>>(url , { headers: getHeader(ctx) }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getRepoInfo(ctx: Command, repoName: string, data:{"includeCreated": boolean, "includeSize": boolean}) {
  let url = getBaseUrl(ctx) + docker_repository_url + repoName;
  return axios.get<IServerResult<IAppVO>>(url , { headers: getHeader(ctx), params: data }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function share(ctx: any, repoName: string, repoTag: string, data: any) {
  let url = getBaseUrl(ctx) + docker_repository_url + repoTag + '/share?repository=' + repoName;
  return axios.post(url, {}, { headers: getHeader(ctx), params: data })
    .catch((error) => {
      console.log('error');
      throw common.handleRequestError(error);
    });
}

function getHeader(ctx: Command, contentType = 'text/html; charset=UTF-8') {
  return { Authorization: readToken(ctx), 'Content-Type' : contentType};
}




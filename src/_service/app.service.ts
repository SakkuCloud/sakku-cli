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
import { app_url } from '../consts/urls';
import { file_url } from '../consts/urls';
import { IApp, IAppVO } from '../interfaces/app.interface';
import IServerResult from '../interfaces/server-result.interface';
import { readLocalApps } from '../utils/read-from-file';
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';
import { start } from 'repl';

export const appService = {
  create,
  stop,
  get,
  getByName,
  list,
  getAppFromFile,
  scale,
  getCollaborators,
  addCollaborator,
  editCollaborator,
  deleteCollaborator,
  logs,
  getToken,
  dir,
  getDownloadLink,
  download,
  upload,
  changeConfig
};
let stat = util.promisify(fs.stat);

function create(ctx: Command, data: {}) {
  console.log(getHeader(ctx));
  return axios.post(app_url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function get(ctx: Command, id: string) {
  return axios.get<IServerResult<IAppVO>>(app_url + '/' + id, { headers: getHeader(ctx) }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getByName(ctx: Command, name: string) {
  return axios.get<IServerResult<IAppVO>>(app_url + '/byname/' + name, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function stop(ctx: Command, id: string) {
  return axios.get(`${app_url}/${id}/stop`, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });;
}

function list(ctx: Command, page = 1, data: IApp[] = []): Promise<IApp[]> {
  return new Promise((accept, reject) => axios.get<IServerResult<IApp[]>>(app_url, {
    headers: getHeader(ctx), params: {
      page,
      size: 15
    }
  })
    .then(res => {
      if (res && res.data && !res.data.error && res.data.result) {
        data.push(...res.data.result);
        accept(res.data.result.length > 0 ? list(ctx, page + 1, data) : data);
      }
      else {
        reject(res);
      }
    })
    .catch(err => {
      throw common.handleRequestError(err)
    }));
}

function getAppFromFile(ctx: Command, id: string) {
  let testApp = readLocalApps(ctx);
  try {
    let appsJson = JSON.parse(testApp);
    return appsJson.forEach((app: IApp) => {
      if (app.id.toString().startsWith(id))
        return app;
    });
  }
  catch (e) {
    return null;
  }
}

function scale(ctx: any, id: any, data: any) {
  let url = app_url + '/' + id + '/config'
  return axios.put(url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function changeConfig(ctx: any, id: any, data: any) {
  let url = app_url + '/' + id + '/config'
  return axios.put(url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getCollaborators(ctx: any, id: any) {
  let url = app_url + '/' + id + '/collaborators'
  return axios.get(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function addCollaborator(ctx: any, id: any, data: any) {
  let url = app_url + '/' + id + '/collaborators?level=7'
  return axios.post(url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function editCollaborator(ctx: any, id: any, cid: any, data: any) {
  let url = app_url + '/' + id + '/collaborators/' + cid + '?level=7'
  return axios.post(url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function deleteCollaborator(ctx: any, id: any, cid: any) {
  let url = app_url + '/' + id + '/collaborators/' + cid;
  return axios.delete(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function logs(ctx: any, id: any, time: any) {
  let url = app_url + '/' + id + '/logs?time=' + time;
  return axios.get(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function dir(ctx: any, id: any, data: object) {
  let url = file_url + '/' + id + '/dir';
  return axios.get(url, { headers: getHeader(ctx), params: data })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getDownloadLink(ctx: any, id: any, data: object) {
  let url = file_url + '/download/' + id;
  return axios.get(url, { headers: getHeader(ctx), params: data })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function download(ctx: any, id: any, directory: string, fileName: string) {
  let url = file_url + '/get/' + id;
  if (directory.substr(directory.length - 1) !== '/' && directory.substr(directory.length - 1) !== '\\') {
    directory += '/';
  }
  return stat(directory)
    .then((result) => {
      return startDownload();
    })
    .catch((error) => {
      return mkdirp(directory)
        .then(() => {
          return startDownload();
        })
        .catch((error: any) => {
          throw common.handleRequestError(error);
        });
    });

  function startDownload() {
    return axios.get(url, { headers: getHeader(ctx), responseType: 'stream' })
      .then((response: any) => {
        response.data.pipe(fs.createWriteStream(directory + fileName + '.zip'));
        return true;
      });
  }
}

function upload(ctx: any, id: any, fullPath: string, data: { containerId: string, path: string }) {
  let defer = q.defer();
  let url = file_url + '/' + id + '/upload';
  let ext = path.extname(fullPath);
  let fileName = path.basename(fullPath);
  let mimeType = mime.getType(fullPath);
  let headers = {
    "Content-Type": "multipart/form-data"
  };

  var options = {
    'method': 'POST',
    'url': url,
    'headers': Object.assign(getHeader(ctx), { 'Content-Type': 'multipart/form-data' }),
    formData: {
      'containerId': data.containerId,
      'path': data.path,
      'file': {
        'value': fs.createReadStream(fullPath),
        'options': {
          'filename': fileName,
          'contentType': mimeType
        }
      }
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

function getHeader(ctx: Command) {
  return { Authorization: readToken(ctx) };
}

function getToken(ctx: Command) {
  return readToken(ctx).split(' ')[1];
}




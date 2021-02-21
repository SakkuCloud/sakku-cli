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
const FormData = require('form-data');
const q = require('q');
const readFile = util.promisify(fs.readFile);

// Project Modules
import { app_url, metrics_app_url } from '../consts/urls';
import { file_url } from '../consts/urls';
import { IApp, IAppVO } from '../interfaces/app.interface';
import IServerResult from '../interfaces/server-result.interface';
import { readLocalApps } from '../utils/read-from-file';
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';
import { getBaseUrl } from '../utils/get-urls-based-zone';

export const appService = {
  create,
  getAppGroupConfig,
  createPipeline,
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
  exportLogs,
  getToken,
  dir,
  getDownloadLink,
  download,
  upload,
  changeConfig,
  allHealthCheck,
  createHealthCheck,
  rmHealthCheck,
  runHealthCheck,
  metrics,
  commit,
  restart,
  rebuild
};
let stat = util.promisify(fs.stat);

function create(ctx: Command, data: {}) {
  const url = getBaseUrl(ctx) + app_url;
  return axios.post(url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getAppGroupConfig(ctx: Command, fullPath: string) {
  const url = getBaseUrl(ctx) + app_url + '/group/config';
  let defer = q.defer();
  let fileName = path.basename(fullPath);
  let mimeType = mime.getType(fullPath);
  var options = {
    'method': 'POST',
    'url': url,
    'headers': Object.assign(getHeader(ctx), { 'Content-Type': 'multipart/form-data' }),
    formData: {
      'composeFile': {
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

function createPipeline(ctx: Command, data: {}) {
  const url = getBaseUrl(ctx) + app_url + '/pipeline';
  return axios.post(url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function get(ctx: Command, id: string) {
  const url = getBaseUrl(ctx) + app_url + '/' + id;
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx) }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getByName(ctx: Command, name: string) {
  const url = getBaseUrl(ctx) + app_url + '/byname/' + name;
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function stop(ctx: Command, id: string, data: any) {
  const url = getBaseUrl(ctx) + app_url + '/' + id + '/stop';
  return axios.get(url, { headers: getHeader(ctx), params:data })
    .catch((error) => {
      throw common.handleRequestError(error);
    });;
}

function list(ctx: Command, page = 1, data: IApp[] = []): Promise<IApp[]> {
  const url = getBaseUrl(ctx) + app_url;
  return new Promise((accept, reject) => axios.get<IServerResult<IApp[]>>(url, {
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
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/config';
  return axios.put(url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function changeConfig(ctx: any, id: any, data: any) {
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/config';
  return axios.put(url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getCollaborators(ctx: any, id: any) {
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/collaborators';
  return axios.get(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function addCollaborator(ctx: any, id: any, queryParam:any, data: any) {
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/collaborators';
  return axios.post(url, data, { headers: getHeader(ctx), params:queryParam })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function editCollaborator(ctx: any, id: any, cid: any, queryParam:any, data: any) {
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/collaborators/' + cid;
  return axios.post(url, data, { headers: getHeader(ctx), params:queryParam })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function deleteCollaborator(ctx: any, id: any, cid: any) {
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/collaborators/' + cid;
  return axios.delete(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function logs(ctx: any, id: any, time: any) {
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/logs?time=' + time;
  return axios.get(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function exportLogs(ctx: any, id: string, data: any) {
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/logs/export';
  return axios.get(url, {params: data})
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function dir(ctx: any, id: any, data: object) {
  let url = getBaseUrl(ctx) + file_url + '/' + id + '/dir';
  return axios.get(url, { headers: getHeader(ctx), params: data })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getDownloadLink(ctx: any, id: any, data: object) {
  let url = getBaseUrl(ctx) + file_url + '/download/' + id;
  return axios.get(url, { headers: getHeader(ctx), params: data })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function download(ctx: any, id: any, directory: string, fileName: string) {
  let url = getBaseUrl(ctx) + file_url + '/get/' + id;
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
  let url = getBaseUrl(ctx) + file_url + '/' + id + '/upload';
  let ext = path.extname(fullPath);
  let fileName = path.basename(fullPath);
  let mimeType = mime.getType(fullPath);

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

function allHealthCheck(ctx: Command, appId: string) {
  let url = getBaseUrl(ctx) + app_url + '/' +  appId + '/healthCheck';
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function runHealthCheck(ctx: Command, appId: string, hId: string) {
  let url = getBaseUrl(ctx) + app_url + '/' +  appId + '/check/' + hId;
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function createHealthCheck(ctx: Command, appId:string, data: {}) {
  let url = getBaseUrl(ctx) + app_url + '/' +  appId + '/healthCheck';
  return axios.post(url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function rmHealthCheck(ctx: Command, appId: string, hId: string) {
  let url = getBaseUrl(ctx) + app_url + '/' + appId + '/healthCheck/' + hId;
  return axios.delete(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });
}

function metrics(ctx: Command, appId: string) {
  let url = getBaseUrl(ctx) + metrics_app_url  + appId;
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx) }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function commit(ctx: Command, id: number, data: any) {
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/commit';
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx), params: data }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function restart(ctx: Command, id: number, data: any) {
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/restart';
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx), params: data }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function rebuild(ctx: Command, id: number, data: any) {
  let url = getBaseUrl(ctx) + app_url + '/' + id + '/rebuild';
  return axios.get<IServerResult<IAppVO>>(url, { headers: getHeader(ctx), params: data }).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getHeader(ctx: Command) {
  return { Authorization: readToken(ctx) };
}

function getToken(ctx: Command) {
  return readToken(ctx).split(' ')[1];
}




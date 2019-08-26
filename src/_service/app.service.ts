// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';

// Project Modules
import { app_url } from '../consts/urls';
import { IApp, IAppVO } from '../interfaces/app.interface';
import IServerResult from '../interfaces/server-result.interface';
import { readLocalApps } from '../utils/read-from-file';
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';

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
  getToken
};

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

function getHeader(ctx: Command) {
  return { Authorization: readToken(ctx) };
}

function getToken(ctx: Command) {
  return readToken(ctx).split(' ')[1];
}




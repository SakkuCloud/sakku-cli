// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';

// Project Modules
import { readToken } from '../utils/read-token';
import { catalog_url, catalog_deploy, catalog_apps } from '../consts/urls';
import IServerResult from '../interfaces/server-result.interface';


export const catalogService = {
  getAllCatalogs,
  getAllCatalogApps,
  catalogDeploy
};

function getAllCatalogs(ctx: any) {
  return axios.get(catalog_url, { headers: getHeader(ctx) });
}

function getAllCatalogApps(ctx: any, id: any) {
  let url = catalog_apps + id;
  return axios.get(url, { headers: getHeader(ctx) });
}


function catalogDeploy(ctx: any, id: any, data: any) {
  let url = catalog_deploy + id;
  return axios.post(url, data, { headers: getHeader(ctx) });
}

function getHeader(ctx: any) {
  return { Authorization: readToken(ctx) };
}

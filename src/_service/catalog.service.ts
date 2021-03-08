// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';

// Project Modules
import { readToken } from '../utils/read-token';
import { catalog_url, catalog_deploy, catalog_apps } from '../consts/urls';
import { common } from '../utils/common';
import { getBaseUrl } from '../utils/get-urls-based-zone';

export const catalogService = {
  getAllCatalogs,
  getAllCatalogApps,
  catalogDeploy
};

function getAllCatalogs(ctx: Command) {
  let url = getBaseUrl(ctx) + catalog_url;
  return axios.get(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });;
}

function getAllCatalogApps(ctx: Command, id: any) {
  let url = getBaseUrl(ctx) + catalog_apps + id;
  return axios.get(url, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });;
}


function catalogDeploy(ctx: Command, id: any, data: any) {
  let url = getBaseUrl(ctx) + catalog_deploy + id;
  return axios.post(url, data, { headers: getHeader(ctx) })
    .catch((error) => {
      throw common.handleRequestError(error);
    });;
}

function getHeader(ctx: Command) {
  return { Authorization: readToken(ctx) };
}

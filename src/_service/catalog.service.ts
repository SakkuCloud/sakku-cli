// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';

// Project Modules
import { readToken } from '../utils/read-token';
import { catalog_url } from '../consts/urls';
import IServerResult from '../interfaces/server-result.interface';


export const catalogService = {
  getAll
};

function getAll(ctx: any) {
  return axios.get(catalog_url, { headers: getHeader(ctx) });
}

function getHeader(ctx: any) {
  return { Authorization: readToken(ctx) };
}

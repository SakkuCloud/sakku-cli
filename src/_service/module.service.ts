// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';

// Project Modules
import { module_url, module_dbaas_url} from '../consts/urls';
import { IAppVO } from '../interfaces/app.interface';
import IServerResult from '../interfaces/server-result.interface';
import { readToken } from '../utils/read-token';
import { common } from '../utils/common';
import { getBaseUrl } from '../utils/get-urls-based-zone';

export const moduleService = {
  dBaseExport,

};

function dBaseExport(ctx: Command, dBaseId: number) {
  let url = getBaseUrl(ctx) + module_dbaas_url + dBaseId + '/export';
  return axios.get<IServerResult<IAppVO>>(url , { headers: getHeader(ctx)}).
    catch((error) => {
      throw common.handleRequestError(error);
    });
}

function getHeader(ctx: Command) {
  return { Authorization: readToken(ctx) };
}
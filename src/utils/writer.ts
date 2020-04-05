import {Command} from '@oclif/command';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function writeToken(ctx: Command, data: {token?: string}) {
  if (data.token) {
    let configUri = path.join(ctx.config.configDir, 'token');
    console.log(ctx.config.configDir);
    if (!fs.pathExistsSync(ctx.config.configDir)) fs.mkdirSync(ctx.config.configDir);
    fs.writeFileSync(configUri, data.token, {encoding: 'utf-8'});
  }
}

export async function writeOverview(ctx: Command, data: string) {
  let configUri = path.join(ctx.config.configDir, 'overview');
  if (!fs.pathExistsSync(ctx.config.configDir)) fs.mkdirSync(ctx.config.configDir);
  fs.writeFileSync(configUri, data, {encoding: 'utf-8'});
}

export async function writeLocalApps(ctx: Command, data: any) {
  let configUri = path.join(ctx.config.configDir, 'local.apps');
  if (!fs.pathExistsSync(configUri)) {
    if (!fs.pathExistsSync(ctx.config.configDir)) fs.mkdirSync(ctx.config.configDir);
    fs.writeFileSync(configUri, '', {encoding: 'utf-8'});
  }
  fs.appendFileSync(configUri, `{${data}},\n`, {encoding: 'utf-8'});
}

export async function writeApps(ctx: Command, data: any) {
  let configUri = path.join(ctx.config.configDir, 'apps');
  if (!fs.pathExistsSync(configUri)) {
    if (!fs.pathExistsSync(ctx.config.configDir)) fs.mkdirSync(ctx.config.configDir);
    fs.writeFileSync(configUri, '', {encoding: 'utf-8'});
  }
  fs.appendFileSync(configUri, `{${data}},\n`, {encoding: 'utf-8'});
}

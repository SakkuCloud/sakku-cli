import {Command} from '@oclif/command';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function readFromConfigSync(ctx: any) {
  return fs.readFile(path.join(ctx.config.configDir, 'config.json'), 'utf-8');
}

export function readLocalApps(ctx: Command) {
  return fs.readFileSync(path.join(ctx.config.configDir, 'local.Apps'), 'utf-8');
}

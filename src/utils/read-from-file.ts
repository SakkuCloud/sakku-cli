// Native Modules
import * as path from 'path';

// External Modules
import {Command} from '@oclif/command';
import * as fs from 'fs-extra';


export async function readFromConfigSync(ctx: any) {
  return fs.readFile(path.join(ctx.config.configDir, 'config.json'), 'utf-8');
}

export function readLocalApps(ctx: Command) {
  return fs.readFileSync(path.join(ctx.config.configDir, 'local.Apps'), 'utf-8');
}

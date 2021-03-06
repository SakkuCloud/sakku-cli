// Native Modules
import * as fs from 'fs-extra';
import * as path from 'path';

// External Modules
import { Command } from '@oclif/command';

// Project Modules
import { messages } from '../consts/msg';

export function readDatacenterZone(ctx: Command) {
  let zone: string = 'serverius';
  try { 
    zone = fs.readFileSync(path.join(ctx.config.configDir, 'zone'), 'utf-8');
  }
  catch (e) {
    if (e.hasOwnProperty('code') && e.code === 'ENOENT') {
      throw { code: e.code, message: messages.zone_is_not_set }
    }
    else {
      throw e;
    }
  }
  return zone;
}

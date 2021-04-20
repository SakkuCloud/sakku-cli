// Native Modules
import * as fs from 'fs-extra';
import * as path from 'path';

// External Modules
import { Command } from '@oclif/command';

// Project Modules
import { messages } from '../consts/msg';
import { IZoneInfo } from '../interfaces/auth.interface';
let datacenterInfo: IZoneInfo;

export function readDatacenterInfo(ctx: Command) {
  try { 
    datacenterInfo = JSON.parse(fs.readFileSync(path.join(ctx.config.configDir, 'urlInfo'), 'utf-8'));
  }
  catch (e) {
    if (e.hasOwnProperty('code') && e.code === 'ENOENT') {
      throw { code: e.code, message: messages.zone_is_not_set }
    }
    else {
      throw e;
    }
  }
  return datacenterInfo;
}

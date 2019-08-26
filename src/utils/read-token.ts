// Native Modules
import * as fs from 'fs-extra';
import * as path from 'path';

// External Modules
import { Command } from '@oclif/command';

// Project Modules
import { messages } from '../consts/msg'

export function readToken(ctx: Command) {
  try {
    return fs.readFileSync(path.join(ctx.config.configDir, 'token'), 'utf-8');
  }
  catch (e) {
    if (e.hasOwnProperty('code') && e.code === 'ENOENT') {
      throw { code: e.code, message: messages.not_logged_in }
    }
    else {
      throw e;
    }
  }
}

export function readConfig(ctx: Command) {
  return fs.readFileSync(path.join(ctx.config.configDir, 'config'), 'utf-8');
}

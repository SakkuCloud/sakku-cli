// Native Modules
import * as fs from 'fs-extra';
import * as path from 'path';

// External Modules
import { Command } from '@oclif/command';

// Project Modules
import { messages } from '../consts/msg';
import { api_sakku_base_url_khatam, api_sakku_base_url_serverius, sakku_panel_auth_url_khatam, sakku_panel_auth_url_serverius, webSocket_url_khatam, webSocket_url_serverius } from '../consts/urls';

export function getBaseUrl(ctx: Command) {
  let zone: string;
  try {
    zone = fs.readFileSync(path.join(ctx.config.configDir, 'zone'), 'utf-8');
  }
  catch (e) {
    if (e.hasOwnProperty('code') && e.code === 'ENOENT') {
      throw { code: e.code, message: messages.not_logged_in }
    }
    else {
      throw e;
    }
  }
  return (zone == 'khatam') ? api_sakku_base_url_khatam : api_sakku_base_url_serverius;
}

export function getWebSocketUrl(ctx: Command) {
  let zone: string;
  try {
    zone = fs.readFileSync(path.join(ctx.config.configDir, 'zone'), 'utf-8');
  }
  catch (e) {
    if (e.hasOwnProperty('code') && e.code === 'ENOENT') {
      throw { code: e.code, message: messages.not_logged_in }
    }
    else {
      throw e;
    }
  }
  return (zone == 'khatam') ? webSocket_url_khatam : webSocket_url_serverius;
}

export function getPanelAuthUrl(ctx: Command) {
  let zone: string;
  try {
    zone = fs.readFileSync(path.join(ctx.config.configDir, 'zone'), 'utf-8');
  }
  catch (e) {
    if (e.hasOwnProperty('code') && e.code === 'ENOENT') {
      throw { code: e.code, message: messages.not_logged_in }
    }
    else {
      throw e;
    }
  }
  return (zone == 'khatam') ? sakku_panel_auth_url_khatam : sakku_panel_auth_url_serverius;
}

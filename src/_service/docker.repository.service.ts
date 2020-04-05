// Native Modules
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

// External Modules
import { Command } from '@oclif/command';
import axios from 'axios';
const request = require('request');
const mime = require('mime');
const q = require('q');

// Project Modules
import { docker_repository_url } from '../consts/urls';
import { readToken } from '../utils/read-token';

export const dockerRepositoryService = {
  build,
};

function build(ctx: any, fullPath: string, settings: { name: string, tag: string, dockerFile: string , buildArgs: string}) {
  console.log(fullPath);
  let defer = q.defer();
  let url = docker_repository_url + 'build';
  let ext = path.extname(fullPath);
  let fileName = path.basename(fullPath);
  let mimeType = mime.getType(fullPath);
  let settings_string = JSON.stringify(settings);
  let headers = {
    "Content-Type": "multipart/form-data"
  };

  var options = {
    'method': 'POST',
    'url': url,
    'headers': Object.assign(getHeader(ctx), headers),
    formData: {
      'file': {
        'value': fs.createReadStream(fullPath),
        'options': {
          'filename': fileName,
          'contentType': mimeType
        }
      },
      settings_string
    }
  };
  // console.log(JSON.stringify(options, null,2));
  request(options, function (error: any, response: { body: any; }) {
    if (error) {
      defer.reject(error);
    }
    else {
      defer.resolve(response.body);
    }
  });

  return defer.promise;
}

function getHeader(ctx: Command, contentType = 'text/html; charset=UTF-8') {
  return { Authorization: readToken(ctx), 'Content-Type' : contentType};
}




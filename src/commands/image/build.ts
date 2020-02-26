// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
const util = require('util');
const q = require('q');
const exec = util.promisify(require('child_process').exec);


// Project Modules
import { appService } from '../../_service/app.service';
import { authService } from '../../_service/auth.service';
import { messages } from '../../consts/msg';
import { sakkuRegUrl, gitlabRegUrl } from '../../consts/val';
import { common } from '../../utils/common';
import { triggerAsyncId } from 'async_hooks';

export default class Build extends Command {
  static description = 'app build';

  static examples = [
    `$ sakku app:build
Enter your docker file dir
Enter your app ports`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'Image name' }),
    tag: flags.string({ char: 't', description: 'Image tag' }),
    build_args: flags.string({ char: 'b', description: 'Build Arguments' }),
    mode: flags.enum({ char: 'e', options: ['remote', 'local'], description: 'Build mode : local or remote' }),
    file: flags.string({ char: 'f', description: 'Docker file name or path' }),
  };

  static args = [];

  async run() {
    let self = this;
    const { args, flags } = this.parse(Build);
    let dockerFileDir: string;
    let name: string;
    let tag: string;
    let email: string;
    let token: string;
    let username: string;
    let build_args = '';
    let mode : string;
    let authServiceResult : any;
   
    if (flags.hasOwnProperty('file') && flags.file) {
      dockerFileDir = flags.file;
    }
    else {
      dockerFileDir = await cli.prompt(messages.enter_docker_file_address, { required: false });
    }

    if (flags.hasOwnProperty('name') && flags.name) {
      name = flags.name;
    }
    else {
      name = await cli.prompt(messages.enter_image_name, { required: true });
    }

    if (flags.hasOwnProperty('tag') && flags.tag) {
      tag = flags.tag;
    }
    else {
      tag = await cli.prompt(messages.enter_local_image_tag, { required: false });
    }

    if (flags.hasOwnProperty('mode') && flags.mode) {
      mode = flags.mode;
    }
    else {
      mode = await cli.prompt(messages.enter_build_mode, { required: true });
    }

    if (flags.hasOwnProperty('build_args') && flags.build_args) {
      build_args = flags.build_args;
    }
    else {
      while (await cli.confirm(messages.more_build_args)) {
        build_args = build_args + ' ' + await cli.prompt(messages.enter_build_arg, { required: false });
      }
    }
    
    if (mode == 'local') {
      try {
        await isDockerInstalled(); 
      }
      catch (error) {
        common.logError(error);
      }

      try {
        await isDockerRun(); 
      }
      catch (error) {
        common.logError(error);
      }

      try {
        authServiceResult = await authService.overview(self);
      }
      catch (error) {
        common.logError(error);
      } 
      let buildCommand = tag ? ('docker build -t ' + name + ':' + tag + ' ' + dockerFileDir ) : ('docker build -t ' + name + ' ' + dockerFileDir);
      const { stdout, stderr } = await exec(buildCommand);
      console.log('test' + stdout);
      if (stderr) {
        console.error(`error: ${stderr}`);
      }

      try {
        email = authServiceResult.data.result.user.email; 
        username = authServiceResult.data.result.user.username;
      }
      catch (error) {
        common.logError(error);
      }
      
      try {
        token = appService.getToken(self);
      }
      catch (error) {
        common.logError(error);
      }
      
    } else if (mode == 'remote') {

    }
    

    function isDockerInstalled() {
      let defer = q.defer();
      exec('docker', (err: any, stdout: any, stderr: any) => {
        if (err) {
          defer.reject();
        }
        defer.resolve();
      });
      return defer.promise;
    }

    function isImageExists(image: string) {
      let defer = q.defer();
      exec('"docker" image inspect ' + image, (err: any, stdout: any, stderr: any) => {
        if (err) {
          defer.reject(err);
        }
        defer.resolve();
      });
      return defer.promise;
    }

    function isDockerRun() {
      let defer = q.defer();
      exec('"docker" info ', (err: any, stdout: any, stderr: any) => {
        if (err) {
          defer.reject(err);
        }
        defer.resolve();
      });
      return defer.promise;
    }

    function dockerLogin() {
      let defer = q.defer();
      let command = '"docker" login -u=' + email + ' -p=' + token + ' ' + sakkuRegRaw;
      exec(command, (err: any, stdout: any, stderr: any) => {
        if (err) {
          defer.reject(err);
        }
        defer.resolve(stdout);
      });
      return defer.promise;
    }

    function dockerCreateTag(sakkuImage: string) {
      let defer = q.defer();
      let command = '"docker" tag ' + (name + ":" + tag) + ' ' + sakkuRegRaw + '/' + username + '/' + sakkuImage;
      exec(command, (err: any, stdout: any, stderr: any) => {
        if (err) {
          defer.reject(err);
        }
        defer.resolve(stdout);
      });
      return defer.promise;
    }

    function dockerPush(sakkuImage: string) {
      let defer = q.defer();
      let command = '"docker" push ' + sakkuRegRaw + '/' + username + '/' + sakkuImage;
      exec(command, (err: any, stdout: any, stderr: any) => {
        if (err) {
          defer.reject(err);
        }
        defer.resolve(stdout);
      });
      return defer.promise;
    }
  }
}
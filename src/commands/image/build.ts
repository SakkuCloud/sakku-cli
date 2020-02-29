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
import { sakkuRegRaw } from '../../consts/val';
import { common } from '../../utils/common';

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
    let dockerFileDir = ' . ';
    let imageName: string;
    let imageTag: string;
    let email: string;
    let token: string;
    let username: string;
    let build_args = '';
    let mode : string;
    let authServiceResult : any;

    // check build mode : remote or local?
    if (flags.hasOwnProperty('mode') && flags.mode) {
      mode = flags.mode;
    }
    else {
      mode = await cli.prompt(messages.enter_build_mode, { required: true });
    }
    
    // local mode :
    if (mode == 'local') {
      // check docker is installed and is run
      try {
        await isDockerInstalled(); 
        try {
          await isDockerRun();
          // image name
          if (flags.hasOwnProperty('name') && flags.name) {
            imageName = flags.name;
          }
          else {
            imageName = await cli.prompt(messages.enter_image_name, { required: true });
          }
          // image tag
          if (flags.hasOwnProperty('tag') && flags.tag) {
            imageTag = flags.tag;
          }
          else {
            imageTag = await cli.prompt(messages.enter_local_image_tag, { required: false });
          }
          // build arguments
          if (flags.hasOwnProperty('build_args') && flags.build_args) {
            build_args = flags.build_args;
          }
          else {
            while (await cli.confirm(messages.more_build_args)) {
              build_args = build_args + ' ' + await cli.prompt(messages.enter_build_arg, { required: false });
            }
          }
          // docker file path and name
          if (flags.hasOwnProperty('file') && flags.file) {
            dockerFileDir = flags.file;
          }
          else {
            dockerFileDir = await cli.prompt(messages.enter_docker_file_address, { required: false });
          }
          // ... 
          try {
            authServiceResult = await authService.overview(self);
            email = authServiceResult.data.result.user.email; 
            username = authServiceResult.data.result.user.username;
            // create build command
            let buildCommand = imageTag ? ('docker build -t ' + sakkuRegRaw + '/' + username + '/' + imageName + ':' + imageTag) : ('docker build -t ' + sakkuRegRaw + '/' + username + '/' + imageName );
            buildCommand = build_args ? buildCommand + ' --build-arg ' + build_args : buildCommand;
            buildCommand = dockerFileDir ? buildCommand + ' -f ' + dockerFileDir : buildCommand;
            buildCommand = buildCommand + ' .';
            // execute build command
            console.log("trying to create image ...");
            const { stdout, stderr } = await exec(buildCommand);
            console.log(stdout);
            if (stderr) {
              console.error(`error: ${stderr}`);
            }
            // login to sakku registry and push image
            token = await appService.getToken(self);
            console.log("trying to login ... \n");
            await dockerLogin();

            console.log("trying to push...");
            await dockerPush(imageName);
            console.log(messages.deploySuccess);
            
          }
          catch (error) {
            common.logDockerError(error);
          }
        }
        catch (error) {
          console.log(messages.docker_not_running);
        }
      }
      catch (error) {
        console.log(messages.docker_not_installed);
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
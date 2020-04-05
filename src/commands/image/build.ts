// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
const util = require('util');
const q = require('q');
const uniqid = require('uniqid');
const fse = require('fs-extra');
const archiver = require('archiver');
const exec = util.promisify(require('child_process').exec);


// Project Modules
import { appService } from '../../_service/app.service';
import { authService } from '../../_service/auth.service';
import { messages } from '../../consts/msg';
import { sakkuRegRaw } from '../../consts/val';
import { common } from '../../utils/common';
import { dockerRepositoryService } from '../../_service/docker.repository.service';

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
    mode: flags.enum({ char: 'm', options: ['remote', 'local'], description: 'Build mode : local or remote' }),
    file: flags.string({ char: 'f', description: 'Docker file name or path' }),
  };

  static args = [];

  async run() {
    let self = this;
    const { args, flags } = this.parse(Build);
    let dockerFileDir: string;
    let imageName: string;
    let imageTag: string;
    let email: string;
    let token: string;
    let username: string;
    let build_args = '';
    let mode : string;
    let authServiceResult : any;

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
            console.log("Trying to login to Sakku Registry ...");
            await dockerLogin();
            console.log(messages.login_success);

            console.log("Trying to push image ...");
            await dockerPush(imageName);
            console.log(messages.image_pushed_success);
            
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
      let zipFileSize = 0;
      let settings = {
        'name': imageName,
        'tag': imageTag,
        'dockerFile': dockerFileDir ? dockerFileDir : "Dockerfile",
        'buildArgs': build_args,
      };

      let archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });

      let zipPackageName = uniqid.time('buildRemote_', '.zip');
      let tempFileDir = 'tmp/';
      try {
        await fse.ensureDir(tempFileDir);
      } catch (err) {
        console.error(err)
      }
      
      let stream = await fse.createWriteStream(tempFileDir + zipPackageName);
      try {
        await archive.directory('.', false) 
        .pipe(stream);
        await stream.on('close', function() {
          zipFileSize = Math.ceil(archive.pointer() / (1024 * 1024));
          console.log(zipFileSize + ' megabytes');
          console.log(messages.zip_file_create_success);
        });
        await archive.finalize();
        if (zipFileSize < 150) {
          try {
            await dockerRepositoryService.build(self, tempFileDir + zipPackageName, settings);
            console.log(messages.remote_build_success);
            await fse.emptyDir(tempFileDir);
            console.log(messages.empty_temp_folder_success);
          }
          catch (error) {
            console.log(error);
          }
        }
        else {
          console.log(messages.zip_file_size_is_big);
        }
      }
      catch (error) {
        console.log(error);
      }
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


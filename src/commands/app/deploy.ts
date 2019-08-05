// External Modules
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
const { exec } = require('child_process');
const q = require('q');
import inquirer = require('inquirer');

// Project Modules
import { authService } from '../../_service/auth.service';
import { appService } from '../../_service/app.service';
// import deployBinary from '../../deployment/deploy-binary';
// import deployImage from '../../deployment/deploy-image';
// import deploySrc from '../../deployment/deploy-source';


export default class Deploy extends Command {
  static description = 'deploy app';

  // static question = {
  //   name: 'type',
  //   message: 'choose type of deploy',
  //   type: 'list',
  //   choices: [{ name: 'docker image' }, { name: 'executable binary' }, { name: 'raw source' }],
  // };

  static flags = {
    help: flags.help({ char: 'h', hidden: true }),
    app: flags.string({ char: 'a', description: 'app name' }),
    // image: flags.string({char: 'i', exclusive: ['binary', 'source'], description: 'docker-image file'}),
    // binary: flags.string({char: 'b', exclusive: ['image', 'source'], description: 'executable binary file'}),
    // source: flags.boolean({char: 's', exclusive: ['binary', 'image']})
  };

  async run() {
    let self = this;
    let email: string;
    let token: string;
    let username: string;
    let tag = '';
    const { flags } = this.parse(Deploy);
    let appName = await (flags.app ? await flags.app : await cli.prompt('please enter app name', { required: true }));

    isDockerInstalled()
      .then(function () {
        isDockerRun()
          .then(function () {
            authService.overview(self)
              .then(function (result) {
                // @ts-ignore
                email = result.data.result.user.email; username = result.data.result.user.username;
              })
              .then(function () {
                token = appService.getToken(self);
                return dockerLogin();
              })
              .then(function (result) {
                return cli.prompt('Enter your tag(optional): ', { required: false })
              })
              .then(function(answer){
                tag = answer.trim();
                return dockerCreateTag();
              })
              .then(function (result) {
                return dockerPush();
              })
              .then(function () {
                console.log('Deploy completed successfully.');
              })
              .catch(function (err) {
                if (typeof err === 'object') {
                  const code = err.code || (err.response && err.response.status.toString());
                  if (err.response && err.response.data) {
                    console.log('An error occured!', code + ':', err.response.data.message || '');
                  }
                  else if (err.response && err.response.statusText) {
                    console.log('An error occured!', code + ':', err.response.data.statusText || '');
                  }
                  else if (code === 'ENOENT') {
                    console.log('An error occured!', 'You are not logged in');
                  }
                  else {
                    console.log('An error occured!', code);
                  }
                }
                else {
                  console.log('An error occured!', err);
                }
              })
          })
          .catch(function () {
            console.log('Run Docker!')
          })
      })
      .catch(function () {
        console.log('Docker is not installed!')
      });

    function isDockerInstalled() {
      let defer = q.defer();
      // @ts-ignore
      exec('docker', (err, stdout, stderr) => {
        if (err) {
          defer.reject();
        }
        defer.resolve();
      });
      return defer.promise;
    }

    function isDockerRun() {
      let defer = q.defer();
      // @ts-ignore
      exec('"docker" info', (err, stdout, stderr) => {
        if (err) {
          defer.reject();
        }
        defer.resolve();
      });
      return defer.promise;
    }

    function dockerLogin() {
      let defer = q.defer();
      let command = '"docker" login -u=' + email + ' -p=' + token + ' registry.sakku.cloud';
      // @ts-ignore
      exec(command, (err, stdout, stderr) => {
        if (err) {
          defer.reject(err);
        }
        defer.resolve(stdout);
      });
      return defer.promise;
    }

    function dockerCreateTag() {
      let defer = q.defer();
      let command;
      if (tag.length === 0) {
        command = '"docker" tag ' + appName + ' registy.sakku.cloud/ ' + username + '/' + appName;
      }
      else {
        command = '"docker" tag' + appName + ':' + tag + ' registy.sakku.cloud/' + username + '/' + appName + ':' + tag;
      }
      // @ts-ignore
      exec(command, (err, stdout, stderr) => {
        if (err) {
          defer.reject(err);
        }
        defer.resolve(stdout);
      });
      return defer.promise;
    }

    function dockerPush() {
      let defer = q.defer();
      let command;
      if (tag.length === 0) {
        command = '"docker" push registy.sakku.cloud/' + username + '/' + appName;
      }
      else {
        command = '"docker" push registy.sakku.cloud/' + username + '/' + appName + ':' + tag;
      }
      // @ts-ignore
      exec(command, (err, stdout, stderr) => {
        if (err) {
          defer.reject(err);
        }
        defer.resolve(stdout);
      });
      return defer.promise;
    }
  }
}

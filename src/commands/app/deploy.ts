// External Modules
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
const { exec } = require('child_process');
const q = require('q');
import inquirer = require('inquirer');

// Project Modules
import { authService } from '../../_service/auth.service';
import { appService } from '../../_service/app.service';

export default class Deploy extends Command {
  static description = 'deploy app';

  static flags = {
    help: flags.help({ char: 'h', hidden: true }),
    app: flags.string({ char: 'a', description: 'app name' })
  };

  async run() {
    let self = this;
    let email: string;
    let token: string;
    let username: string;
    let tag: string = '';
    let sakkuImage = '';
    const { flags } = this.parse(Deploy);
    let imageName = await (flags.app ? await flags.app : await cli.prompt('please enter local image name', { required: true }));

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
                // return dockerLogin();
              })
              .then(function (result) {
                return cli.prompt('Enter your local image tag (optional, default:latest)', { required: false })
              })
              .then(function (param) {
                tag = (param || "latest").trim();
                return isImageExists(imageName + ":" + tag)
              }).then(function (result) {
                return cli.prompt('Enter your new image name and tag (required format: name:tag)', { required: true })
              })
              .then(function (answer) {
                sakkuImage = answer.trim();
                return dockerCreateTag(sakkuImage);
              })
              .then(function (result) {
                console.log("trying to loging in...")
                return dockerLogin();
              })
              .then(function (result) {
                console.log("trying to push...")
                return dockerPush(sakkuImage);
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
                  else if (err.hasOwnProperty('cmd') && err.cmd.indexOf('login') !== -1) {
                    console.log('An error occured!', 'can not login to docker');
                  }
                  else if (err.hasOwnProperty('cmd') && err.cmd.indexOf('image inspect') !== -1) {
                    console.log('An error occured!', 'image does not exists');
                  }
                  else if (err.hasOwnProperty('cmd') && err.cmd.indexOf('push registy') !== -1) {
                    console.log('An error occured!', 'can not push docker image');
                  }
                  else if (err.hasOwnProperty('cmd') && err.cmd.indexOf('tag') !== -1) {
                    console.log('An error occured!', 'can create tag');
                  }
                  else {
                    console.log('An error occured! code:', code, err);
                  }
                }
                else {
                  console.log('An error occured!', err);
                }
              })
          })
          .catch(function () {
            console.log('Docker is not running! Run Docker or check your dockerd!')
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


    function isImageExists(image: string) {
      //docker image inspect

      let defer = q.defer();
      // @ts-ignore
      exec('"docker" image inspect ' + image, (err, stdout, stderr) => {
        if (err) {
          defer.reject(err);
        }
        defer.resolve();
      });
      return defer.promise;
    }

    function isDockerRun() {
      let defer = q.defer();
      // @ts-ignore
      exec('"docker" info ', (err, stdout, stderr) => {
        if (err) {
          defer.reject(err);
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

    function dockerCreateTag(sakkuImage: string) {
      let defer = q.defer();
      let command = '"docker" tag ' + (imageName + ":" + tag) + ' registy.sakku.cloud/' + username + '/' + sakkuImage;
      // @ts-ignore
      exec(command, (err, stdout, stderr) => {
        if (err) {
          defer.reject(err);
        }
        defer.resolve(stdout);
      });
      return defer.promise;
    }

    function dockerPush(sakkuImage: string) {
      let defer = q.defer();
      let command = '"docker" push registry.sakku.cloud/' + username + '/' + sakkuImage;
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

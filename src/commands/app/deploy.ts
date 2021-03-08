// External Modules
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
const { exec } = require('child_process');
const q = require('q');
import inquirer = require('inquirer');

// Project Modules
import { authService } from '../../_service/auth.service';
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';
import { getSakkuRegRaw } from '../../utils/get-urls-based-zone';

export default class Deploy extends Command {
  static description = 'Deploy an application';

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
    let imageName = await (flags.app ? await flags.app : await cli.prompt(messages.enter_local_image, { required: true }));
    let sakkuRegRaw = getSakkuRegRaw(self);

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
              })
              .then(function (result) {
                return cli.prompt(messages.enter_local_image_tag, { required: false })
              })
              .then(function (param) {
                tag = (param || "latest").trim();
                return isImageExists(imageName + ":" + tag)
              }).then(function (result) {
                return cli.prompt(messages.enter_new_image_name_tag, { required: true })
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
                console.log(messages.deploySuccess);
              })
              .catch(function (err) {
                common.logDockerError(err)
              })
          })
          .catch(function () {
            console.log(messages.docker_not_running)
          })
      })
      .catch(function () {
        console.log(messages.docker_not_installed)
      });

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
      let command = '"docker" tag ' + (imageName + ":" + tag) + ' ' + sakkuRegRaw + '/' + username + '/' + sakkuImage;
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

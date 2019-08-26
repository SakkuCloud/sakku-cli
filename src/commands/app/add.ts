import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';

import { appService } from '../../_service/app.service';
import {
  abort_msg,
  done_msg,
  enter_your_app_name_msg,
  enter_your_args_msg,
  enter_your_cmd_msg,
  enter_your_core_msg,
  enter_your_disk_msg,
  enter_your_environment_key_msg,
  enter_your_environment_value_msg,
  enter_your_git_access_token_msg, enter_your_git_url_msg,
  enter_your_git_username_msg,
  enter_your_image_name_msg,
  enter_your_label_key_msg,
  enter_your_label_value_msg,
  enter_your_link_alias_msg,
  enter_your_link_name_msg,
  enter_your_max_instance_msg,
  enter_your_min_instance_msg,
  enter_your_port_msg,
  enter_your_protocol_msg,
  enter_your_ram_msg,
  w8_msg,
  enter_your_check_point,
  enter_your_response,
  enter_your_scheme
} from '../../consts/msg';
// import {IAppsDeployType} from '../../enums/apps.enum';
import { writeLocalApps } from '../../utils/writer';

export default class Add extends Command {
  static description = 'add new app';
  static port = { port: '', protocol: '' };
  static link = { name: '', alias: '' };
  static flags = { help: flags.help({ char: 'h' }) };

  async run() {
    //const {flags} = this.parse(Add);
    let self = this;
    let maxInstance: any;
    let minInstance: any;
    let disk: any;
    let mem: any;
    let cpu: any;
    let deployType: string;
    let repoName: string;
    let repoAddress: string;
    let git = {
      type: 'github',
      url: '',
      image_name: '',
      accessToken: '',
      username: '',
      docker_file: '/Dockerfile',
      urlBranch: 'master',
      tags: [],
      buildArgs: []
    };
    let args: Array<any> = [];
    let ports: Array<any> = [];
    // let links = [];
    let image: { name: string, registry: string, username: any, accessToken: any } = { name: '', registry: '', username: null, accessToken: null };
    let environments: {
      [key: string]: string;
    } = {};
    let labels: {
      [key: string]: string;
    } = {};
    // @ts-ignore
    let healthChecks = [];
    let sendObj = {};


    let name: any = await cli.prompt(enter_your_app_name_msg, { required: true });
    do {
      cpu = parseFloat(await cli.prompt(enter_your_core_msg, { required: true }));
    } while (isNaN(Number(cpu)));
    do {
      mem = parseFloat(await cli.prompt(enter_your_ram_msg, { required: true }));
    } while (isNaN(Number(mem)));
    do {
      disk = parseFloat(await cli.prompt(enter_your_disk_msg, { required: true }));
    } while (isNaN(Number(disk)));
    while (await cli.confirm('Is there any/more ports (y or n)')) {
      do {
        Add.port.port = await cli.prompt(enter_your_port_msg, { required: false });
      } while (isNaN(Number(Add.port.port)));
      // do {
      Add.port.protocol = await cli.prompt(enter_your_protocol_msg, { required: false });
      // } while (isNaN(Number(Add.port.protocol)));
      ports.push(Add.port);
    }
    do {
      minInstance = parseInt(await cli.prompt(enter_your_min_instance_msg, { required: true }));
    } while (isNaN(Number(minInstance)));
    do {
      maxInstance = parseInt(await cli.prompt(enter_your_max_instance_msg, { required: true }));
    } while (isNaN(Number(maxInstance)));
    let cmd = await cli.prompt(enter_your_cmd_msg, { required: false });
    if (cmd) {
      while (await cli.confirm('Is there any/more args (y or n)')) {
        args.push(await cli.prompt(enter_your_args_msg));
      }
    }

    // @ts-ignore
    let scalingMode = await inquirer.prompt<{ name: string }>({
      name: 'name',
      message: 'choose scaling mode :',
      type: 'list',
      choices: [
        { name: 'CPU' },
        { name: 'MEM' },
        { name: 'AND' },
        { name: 'OR' },
        { name: 'OFF' }]
    }).then(value => value.name);

    while (await cli.confirm('Is there any/more environments (y or n)')) {
      let param: string = await cli.prompt(enter_your_environment_key_msg);
      environments[param] = await cli.prompt(enter_your_environment_value_msg);
    }
    while (await cli.confirm('Is there any/more labels (y or n)')) {
      let param: string = await cli.prompt(enter_your_label_key_msg);
      labels[param] = await cli.prompt(enter_your_label_value_msg);
    }
    // while (await cli.confirm('Is there any/more links (y or n)')) {
    //   Add.link.name = await cli.prompt(enter_your_link_name_msg);
    //   Add.link.alias = await cli.prompt(enter_your_link_alias_msg);
    //   links.push(Add.link);
    // }

    while (await cli.confirm('Is there any/more health checks (y or n)')) {
      let tempObj = {};
      // @ts-ignore
      tempObj.endpoint = (await cli.prompt(enter_your_check_point, { required: false })) || '/ping'
      // @ts-ignore
      tempObj.response = await cli.prompt(enter_your_response, { required: true });
      // @ts-ignore
      tempObj.scheme = (await cli.prompt(enter_your_scheme, { required: false })) || 'http';
      healthChecks.push(tempObj);
    }

    // @ts-ignore
    deployType = await inquirer.prompt<{ name: string }>({
      name: 'name',
      message: 'choose your deploy type:',
      type: 'list',
      choices: [
        { name: 'DOCKER_IMAGE' },
        { name: 'CODE' }
        // {name: 'APP'},
        // {name: 'DOCKER_FILE'}
      ]
    }).then(value => value.name);

    if (deployType === 'DOCKER_IMAGE') {
      // @ts-ignore
      image.registry = await inquirer.prompt<{ name: string }>({
        name: 'name',
        message: 'choose registry:',
        type: 'list',
        choices: [
          { name: 'dockerhub' },
          { name: 'sakkureg' },
          { name: 'gitlab' }]
      })
        .then(value => {
          image.registry = value.name;
          if (image.registry === 'dockerhub') {
            return cli.confirm('Is it a private repository (y or n)')
              .then(function (answer) {
                if (answer) {
                  return cli.prompt('Enter your username', { required: true })
                    .then(function (answer) {
                      image.username = answer;
                      return cli.prompt('Enter your access token', { required: true })
                    })
                    .then(function (answer) {
                      image.accessToken = answer;
                    });
                }
              });
          }
          else if (image.registry === 'gitlab') {
            return cli.prompt('Enter your username', { required: true })
              .then(function (answer) {
                image.username = answer;
                return cli.prompt('Enter your access token', { required: true })
              })
              .then(function (answer) {
                image.accessToken = answer;
              });
          }
        })
        .then(function () {
          return cli.prompt(enter_your_image_name_msg, { required: true });
        })
        .then(value => {
          if (image.registry === 'sakkureg') {
            image.name = 'https://registry.sakku.com/' + value;
          }
          else if (image.registry === 'gitlab') {
            image.name = 'https://registry.gitlab.com/' + value;
          }
          else {
            image.name = value;
          }
        })
        .then(function () {
          sendObj = {
            args,
            cmd,
            cpu,
            deployType,
            disk,
            entrypoint: null,
            environments,
            git: null,
            // @ts-ignore
            healthChecks,
            image,
            labels,
            links: null,
            maxInstance,
            mem,
            minInstance,
            modules: null,
            name,
            ports,
            scalingMode
          }
          console.log(sendObj);
          return appService.create(self, sendObj)
        })
        .then(function () {
          console.log('Your app is successfully added.');
        })
        .catch(function (err) {
          //console.log(err);
          handleError(err);
        });
    }
    else if (deployType === 'CODE') {

      // #0: image_name
      git.image_name = await cli.prompt('Enter your image name', { required: true });

      // #1: url
      git.url = await cli.prompt(enter_your_git_url_msg, { required: true });
      if (!git.url.endsWith('.git')) {
        git.url + '.git'
      }

      git.url = git.url.toLowerCase();
      if (git.url.indexOf('gitlab')) {
        git.type = 'GITHUB';
      }
      else if (git.url.indexOf('github')) {
        git.type = 'GITLAB';
      } 
      else {
        git.type = 'SAKKUGIT';
      }

      // #2: username
      git.username = await cli.prompt(enter_your_git_username_msg, { required: true });

      // #3: accessToken
      git.accessToken = await cli.prompt(enter_your_git_access_token_msg, { required: true });

      // #4: docker_file
      git.docker_file = (await cli.prompt('Enter your docker file address (default is /DockerFile)', { required: false })) || git.docker_file;

      // #5: branch
      git.urlBranch = (await cli.prompt('Enter your branch name (default is master)', { required: false })) || git.urlBranch;

      // #5: tags
      while (await cli.confirm('Is there any/more tags (y or n)')) {
        let inpTag: string = await cli.prompt('Enter your tag');
        // @ts-ignore
        git.tags.push(inpTag);
      }

      // #5: buildTags
      while (await cli.confirm('Is there any/more build arguments (y or n)')) {
        let inpArg: string = await cli.prompt('Enter your build documentّ');
        // @ts-ignore
        git.buildArgs.push(inpArg);
      }

      sendObj = {
        args,
        cmd,
        cpu,
        deployType,
        disk,
        entrypoint: null,
        environments,
        git: git,
        healthChecks,
        image: null,
        labels,
        links: null,
        maxInstance,
        mem,
        minInstance,
        modules: null,
        name,
        ports,
        scalingMode
      }

      console.log(sendObj);

      try {
        await appService.create(self, sendObj);
        console.log('Your app is successfully added.');
      }
      catch (err) {
        handleError(err);
      }

    }

    // @ts-ignore
    function handleError(err) {
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
  }
}

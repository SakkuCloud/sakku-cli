// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { appService } from '../../_service/app.service';
import { messages } from '../../consts/msg';
import { sakkuRegUrl, gitlabRegUrl } from '../../consts/val';
import { common } from '../../utils/common';

export default class Add extends Command {
  static description = 'add new app';
  static port = { port: '', protocol: '' };
  static link = { name: '', alias: '' };
  static flags = { help: flags.help({ char: 'h' }) };

  async run() {
    // const {flags} = this.parse(Add);
    let self = this;
    let maxInstance: any;
    let minInstance: any;
    let disk: number;
    let mem: number;
    let cpu: number;
    let deployType: string;
    let git:
      {
        type: string,
        url: string,
        image_name: string,
        accessToken: string,
        username: string,
        docker_file: string,
        urlBranch: string,
        tags: string[],
        buildArgs: string[]
      } = {
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
    let image: { name: string, registry: string, username: any, accessToken: any } = { name: '', registry: '', username: null, accessToken: null };
    let environments: {
      [key: string]: string;
    } = {};
    let labels: {
      [key: string]: string;
    } = {};
    let healthChecks: { endpoint: string, response: string, scheme: string }[] = [];
    let sendObj = {};

    let name: string = await cli.prompt(messages.enter_your_app_name_msg, { required: true });

    do {
      cpu = parseFloat(await cli.prompt(messages.enter_your_core_msg, { required: true }));
    } while (isNaN(Number(cpu)));

    do {
      mem = parseFloat(await cli.prompt(messages.enter_your_ram_msg, { required: true }));
    } while (isNaN(Number(mem)));

    do {
      disk = parseFloat(await cli.prompt(messages.enter_your_disk_msg, { required: true }));
    } while (isNaN(Number(disk)));

    while (await cli.confirm(messages.ports)) {
      do {
        Add.port.port = await cli.prompt(messages.enter_your_port_msg, { required: false });
      } while (isNaN(Number(Add.port.port)));
      // do {
      Add.port.protocol = await cli.prompt(messages.enter_your_protocol_msg, { required: false });
      // } while (isNaN(Number(Add.port.protocol)));
      ports.push(Add.port);
    }

    do {
      minInstance = parseInt(await cli.prompt(messages.enter_your_min_instance_msg, { required: true }));
    } while (isNaN(Number(minInstance)));

    do {
      maxInstance = parseInt(await cli.prompt(messages.enter_your_max_instance_msg, { required: true }));
    }
    while (isNaN(Number(maxInstance)));

    let cmd = await cli.prompt(messages.enter_your_cmd_msg, { required: false });
    if (cmd) {
      while (await cli.confirm(messages.args)) {
        args.push(await cli.prompt(messages.enter_your_args_msg));
      }
    }

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
    })
      .then(value => value.name);

    while (await cli.confirm(messages.environment_vars)) {
      let param: string = await cli.prompt(messages.enter_your_environment_key_msg);
      environments[param] = await cli.prompt(messages.enter_your_environment_value_msg);
    }

    while (await cli.confirm(messages.labels)) {
      let param: string = await cli.prompt(messages.enter_your_label_key_msg);
      labels[param] = await cli.prompt(messages.enter_your_label_value_msg);
    }

    // while (await cli.confirm('Is there any/more links (y or n)')) {
    //   Add.link.name = await cli.prompt(enter_your_link_name_msg);
    //   Add.link.alias = await cli.prompt(enter_your_link_alias_msg);
    //   links.push(Add.link);
    // }

    while (await cli.confirm(messages.health_check)) {
      let tempObj: { endpoint: string, response: string, scheme: string } = { endpoint: '', response: '', scheme: '' };
      tempObj.endpoint = (await cli.prompt(messages.enter_your_check_point, { required: false })) || '/ping'
      tempObj.response = await cli.prompt(messages.enter_your_response, { required: true });
      tempObj.scheme = (await cli.prompt(messages.enter_your_scheme, { required: false })) || 'http';
      healthChecks.push(tempObj);
    }

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
    })
      .then(value => value.name);

    if (deployType === 'DOCKER_IMAGE') {
      await inquirer.prompt<{ name: string }>({
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
            return cli.confirm(messages.private_repo)
              .then(function (answer) {
                if (answer) {
                  return cli.prompt(messages.enter_username, { required: true })
                    .then(function (answer) {
                      image.username = answer;
                      return cli.prompt(messages.enter_access_token, { required: true })
                    })
                    .then(function (answer) {
                      image.accessToken = answer;
                    });
                }
              });
          }
          else if (image.registry === 'gitlab') {
            return cli.prompt(messages.enter_username, { required: true })
              .then(function (answer) {
                image.username = answer;
                return cli.prompt(messages.enter_access_token, { required: true })
              })
              .then(function (answer) {
                image.accessToken = answer;
              });
          }
        })
        .then(function () {
          return cli.prompt(messages.enter_your_image_name_msg, { required: true });
        })
        .then(value => {
          if (image.registry === 'sakkureg') {
            image.name = sakkuRegUrl + value;
          }
          else if (image.registry === 'gitlab') {
            image.name = gitlabRegUrl + value;
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
          return appService.create(self, sendObj)
        })
        .then(function () {
          console.log(messages.app_add_success);
        })
        .catch(function (err) {
          common.logError(err);
        });
    }
    else if (deployType === 'CODE') {
      // #0: image_name
      git.image_name = await cli.prompt(messages.enter_image_name, { required: true });

      // #1: url
      git.url = await cli.prompt(messages.enter_your_git_url_msg, { required: true });
      if (!git.url.endsWith('.git')) {
        git.url + '.git'
      }

      git.url = git.url.toLowerCase();
      if (git.url.indexOf('gitlab')) {
        git.type = 'GITLAB';
      }
      else if (git.url.indexOf('github')) {
        git.type = 'GITHUB';
      }
      else {
        git.type = 'SAKKUGIT';
      }

      // #2: username
      git.username = await cli.prompt(messages.enter_your_git_username_msg, { required: true });

      // #3: accessToken
      git.accessToken = await cli.prompt(messages.enter_your_git_access_token_msg, { required: true });

      // #4: docker_file
      git.docker_file = (await cli.prompt(messages.enter_docker_file_address, { required: false })) || git.docker_file;

      // #5: branch
      git.urlBranch = (await cli.prompt(messages.enter_branch_name, { required: false })) || git.urlBranch;

      // #5: tags
      while (await cli.confirm(messages.more_tag)) {
        let inpTag: string = await cli.prompt(messages.enter_tag);
        git.tags.push(inpTag);
      }

      // #5: buildTags
      while (await cli.confirm(messages.more_build_args)) {
        let inpArg: string = await cli.prompt(messages.enter_build_arg);
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

      try {
        await appService.create(self, sendObj);
        console.log(messages.app_add_success);
      }
      catch (err) {
        common.logError(err);
      }

    }
  }
}

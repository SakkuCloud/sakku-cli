import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';

import {appService} from '../../_service/app.service';
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
  w8_msg
} from '../../consts/msg';
// import {IAppsDeployType} from '../../enums/apps.enum';
import {writeLocalApps} from '../../utils/writer';

export default class Add extends Command {
  static description = 'add new app';
  static port = {port: '', protocol: ''};
  static link = {name: '', alias: ''};
  static flags = {help: flags.help({char: 'h'})};

  async run() {
    //const {flags} = this.parse(Add);
    let maxInstance: any;
    let minInstance: any;
    let disk: any;
    let mem: any;
    let cpu: any;
    let deployType: string;
    let git: {
      username: string,
      accessToken: string,
      url: string,
      type: 'github' | 'sakkugit' | 'gitlab'
    } = {
      type: 'github',
      url: '',
      accessToken: '',
      username: ''
    };
    let args = [];
    let ports = [];
    let links = [];
    let image: { name: string, registry: string } = {name: '', registry: ''};
    let environments: {
      [key: string]: string;
    } = {};
    let labels: {
      [key: string]: string;
    } = {};
    let name: any = await cli.prompt(enter_your_app_name_msg, {required: true});
    do {
      cpu = await cli.prompt(enter_your_core_msg, {required: true});
    } while (isNaN(Number(cpu)));
    do {
      mem = await cli.prompt(enter_your_ram_msg, {required: true});
    } while (isNaN(Number(mem)));
    do {
      disk = await cli.prompt(enter_your_disk_msg, {required: true});
    } while (isNaN(Number(disk)));
    while (await cli.confirm('is there any/more ports(y or n)?')) {
      do {
        Add.port.port = await cli.prompt(enter_your_port_msg, {required: false});
      } while (isNaN(Number(Add.port.port)));
      // do {
        Add.port.protocol = await cli.prompt(enter_your_protocol_msg, {required: false});
      // } while (isNaN(Number(Add.port.protocol)));
      ports.push(Add.port);
    }
    do {
      minInstance = await cli.prompt(enter_your_min_instance_msg, {required: true});
    } while (isNaN(Number(minInstance)));
    do {
      maxInstance = await cli.prompt(enter_your_max_instance_msg, {required: true});
    } while (isNaN(Number(maxInstance)));
    let cmd = await cli.prompt(enter_your_cmd_msg, {required: false});
    if (cmd) {
      while (await cli.confirm('is there any/more args?')) {
        args.push(await cli.prompt(enter_your_args_msg));
      }
    }

    // @ts-ignore
    let scalingMode = await inquirer.prompt<{ name: string }>({
      name: 'name',
      message: 'choose scaling mode :',
      type: 'list',
      choices: [
        {name: 'CPU'},
        {name: 'MEM'},
        {name: 'AND'},
        {name: 'OR'},
        {name: 'OFF'}]
    }).then(value => value.name);

    while (await cli.confirm('is there any/more environments?')) {
      let param: string = await cli.prompt(enter_your_environment_key_msg);
      environments[param] = await cli.prompt(enter_your_environment_value_msg);
    }
    while (await cli.confirm('is there any/more labels?')) {
      let param: string = await cli.prompt(enter_your_label_key_msg);
      labels[param] = await cli.prompt(enter_your_label_value_msg);
    }
    while (await cli.confirm('is there any/more links?')) {
      Add.link.name = await cli.prompt(enter_your_link_name_msg);
      Add.link.alias = await cli.prompt(enter_your_link_alias_msg);
      links.push(Add.link);
    }

    // @ts-ignore
    deployType = await inquirer.prompt<{ name: string }>({
      name: 'name',
      message: 'choose your deploy type:',
      type: 'list',
      choices: [
        {name: 'DOCKER_IMAGE'},
        {name: 'CODE'}
        // {name: 'APP'},
        // {name: 'DOCKER_FILE'}
      ]
    }).then(value => value.name);

    if (deployType === 'DOCKER_IMAGE') {
      image.name = await cli.prompt(enter_your_image_name_msg, {required: true});
      // @ts-ignore
      image.registry = await inquirer.prompt<{name: string}>({
        name: 'name',
        message: 'choose registry:',
        type: 'list',
        choices: [
          {name: 'dockerhub'},
          {name: 'sakkureg'},
          {name: 'gitlab'}]
      }).then(value => value.name);
    } 
    else if (deployType === 'CODE') {
      git.username = await cli.prompt(enter_your_git_username_msg, {required: true});
      git.accessToken = await cli.prompt(enter_your_git_access_token_msg, {required: true});
      git.url = await cli.prompt(enter_your_git_url_msg, {required: true});

      // @ts-ignore
      git.type = await inquirer.prompt<{ name: string }>({
        name: 'name',
        message: 'choose type:',
        type: 'list',
        choices: [
          {name: 'github'},
          {name: 'sakkugit'},
          {name: 'gitlab'}]
      }).then(value => value.name);
    }

    try {
      let response = await appService.create(this, {
        name,
        cpu,
        mem,
        disk,
        ports,
        minInstance,
        maxInstance,
        cmd,
        scalingMode,
        environments,
        labels,
        links,
        image,
        git,
        deployType
      });
      this.log(JSON.stringify(response));
      await cli.action.start(w8_msg);
      try {
        await fs.realpath(name, (_, resolvedPath) => {
          writeLocalApps(this, `${name}:'${resolvedPath}'`);
        });
        await fs.mkdirSync(name);
        cli.action.stop(done_msg);
        this.log(`${name} is ready :)`);
      } catch (_) {
        cli.action.stop(abort_msg);
        this.log('folder name already exist!!');
      }
    } catch (err) {
      this.log(err.response.data.message);
    }
  }
}

// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';

export default class Port extends Command {
  static description = 'app ports';

  static examples = [
    `$ sakku app:port
Enter your app id: APP-ID
Enter your app ports`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static args = [
    {
      name: 'app',
      required: false,
      description: 'app id/name',
      hidden: false
    },
  ];

  async run() {
    const { args, flags } = this.parse(Port);
    let self = this;
    let appData: any;
    let appId: string;
    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }
    let ports : {containerPort: number, protocol: string, basicAuthentication: boolean, onlyInternal: boolean, ssl: boolean}[]=[];
    let result;
    let sendData = {
      "cpu": null,
      "disk": null,
      "git": null,
      "image": null,
      "instances": null,
      "mem": null,
      "ports": {},
      "rebuild": true,
      "scalingMode": "OFF"
    }

    do {
      let port : {containerPort: number, protocol: string, basicAuthentication: boolean, onlyInternal: boolean, ssl: boolean}
      = {containerPort: 0, protocol: 'http', basicAuthentication: false, onlyInternal: false, ssl: false};
      do {
        port.containerPort = await cli.prompt(messages.enter_your_port_msg, { required: true });
      } while (isNaN(Number(port.containerPort)));
      port.protocol = await cli.prompt(messages.enter_your_protocol_msg, { required: true });
      port.basicAuthentication = await cli.prompt(messages.enter_basic_authentication_port_msg, { required: false });
      port.onlyInternal = await cli.prompt(messages.enter_only_internal_port_msg, { required: false });
      port.ssl = await cli.prompt(messages.enter_your_port_ssl_msg, { required: false });
      ports.push(port);
    }
    while (await cli.confirm(messages.ports));
    sendData.ports = ports;
    try{
      result = await appService.changeConfig(this, appId, sendData);
      this.log(messages.app_change_ports_success);
    }catch(e) {
      console.log(e);
    }
  }
}

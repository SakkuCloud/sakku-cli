import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { networkService } from '../../_service/network.service';
import { messages } from '../../consts/msg';

export default class RmApp extends Command {
  static description = 'Remove app from network';

  static examples = [
    `$ sakku network:rm
Enter your app id: APP-ID
Enter network name: NETWORK-NAME
Are you sure to delete this network? (y or n): y`,
  ];

  // static args = [
  //   {
  //     name: 'app',
  //     required: false,
  //     description: 'sakku network:rm [appId]',
  //     hidden: false
  //   },
  //   {
  //     name: 'name',
  //     required: false,
  //     description: 'sakku network:rm [appId] [name]',
  //     hidden: false
  //   }
  // ];

  static flags = {
    help: flags.help({ char: 'h' }),
    app: flags.integer({ char: 'a', description: 'App Id' }),
    name: flags.string({ char: 'n', description: 'Network Name' }),
    force: flags.boolean({ char: 'f' })
  };

  async run() {
    let self = this;
    let result: any;
    let appId: number;
    let networkName: string;
    let force: boolean;
    let data = {};
    const { args, flags } = this.parse(RmApp);

    if (flags.hasOwnProperty('name') && flags.name) {
      networkName = flags.name;
    }
    else {
      networkName = await cli.prompt(messages.enter_network_name, { required: true });
    }

    if (flags.hasOwnProperty('app') && flags.app) {
      appId = flags.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }

    force = flags.force ? flags.force : false;
    data = {
      appId,
      force
    };

    if (flags.force) {
      await cli.action.start(messages.w8_msg);
      try {
        result = await networkService.rmApp(self, networkName, data);
        this.log(JSON.stringify(result.data ,null, 2));
        cli.action.stop(messages.network_app_remove_success);
      } catch(e) {
        cli.action.stop(JSON.stringify(e ,null, 2));
      } 
    } 
    else {
      let confimation = await cli.confirm(messages.network_app_remove_confirm);
      if (confimation) {
        await cli.action.start(messages.w8_msg);
        try {
          result = await networkService.rmApp(self, networkName, data);
          this.log(JSON.stringify(result.data ,null, 2));
          cli.action.stop(messages.network_app_remove_success);
        } catch(e) {
          cli.action.stop(JSON.stringify(e ,null, 2));
        }
      } 
      else {
        this.log(messages.network_app_remove_cancel);
      }
    }
  }
}
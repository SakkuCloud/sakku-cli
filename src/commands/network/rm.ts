import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { networkService } from '../../_service/network.service';
import { messages } from '../../consts/msg';

export default class Rm extends Command {
  static description = 'Remove network by name';

  static examples = [
    `$ sakku network:rm
Enter network name: NETWORK-NAME
are you really sure to remove this network? (y/n): y`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'Network Name' }),
    force: flags.boolean({ char: 'f' })
  };
  static args = [
    {
      name: 'name',
      required: false,
      description: 'sakku network:rm [name]',
      hidden: false
    }
  ];

  async run() {
    let self = this;
    let result: any;
    let networkName: string;
    let force: boolean;

    const { args, flags } = this.parse(Rm);

    if (args.hasOwnProperty('name') && args.name) {
      networkName = args.network;
    }
    else if (flags.hasOwnProperty('name') && flags.name) {
      networkName = flags.name;
    }
    else {
      networkName = await cli.prompt(messages.enter_network_name, { required: true });
    }

    force = flags.force ? flags.force : false;
    console.log('force: ' + force);
    let data = {
      force
    };

    if (flags.force) {
      await cli.action.start(messages.w8_msg);
      try {
        result = await networkService.rm(self, networkName, data);
        this.log(JSON.stringify(result.data ,null, 2));
        cli.action.stop(messages.network_remove_success);
      } catch(e) {
        cli.action.stop(JSON.stringify(e ,null, 2));
      } 
    } 
    else {
      let confimation = await cli.confirm(messages.network_remove_confirm);
      if (confimation) {
        await cli.action.start(messages.w8_msg);
        try {
          result = await networkService.rm(self, networkName, data);
          this.log(JSON.stringify(result.data ,null, 2));
          cli.action.stop(messages.network_remove_success);
        } catch(e) {
          cli.action.stop(JSON.stringify(e ,null, 2));
        }
      } 
      else {
        this.log(messages.network_remove_cancel);
      }
    }
  }
}

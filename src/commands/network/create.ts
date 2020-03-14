// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { networkService } from '../../_service/network.service';
import { messages } from '../../consts/msg';

export default class Create extends Command {
  static description = 'Create network';

  static examples = [
    `$ sakku network:create
Enter Network Name: NETWORK-NAME`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'Network Name' }),
  };

  static args = [
    {
      name: 'name',
      required: false,
      description: 'sakku network:create [name]',
      hidden: false
    }
  ];

  async run() {
    const { args, flags } = this.parse(Create);
    let self = this;
    let result: any;
    let name: string;
  
    let data = {};

    if (args.hasOwnProperty('name') && args.name) {
      name = args.name;
    }
    else if (flags.hasOwnProperty('name') && flags.name) {
      name = flags.name;
    }
    else {
      name = await cli.prompt(messages.enter_network_name, { required: true });
    }


    data = {
      name
    }
    try {
      result = await networkService.create(self, data);
      this.log(JSON.stringify(result.data ,null, 2));
    } catch(e) {
      console.log(e);
    }
  }
}
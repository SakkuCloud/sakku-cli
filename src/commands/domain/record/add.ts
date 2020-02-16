// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { domainService } from '../../../_service/domain.service';
import { messages } from '../../../consts/msg';

export default class Add extends Command {
  static description = 'add domain';

  static examples = [
    `$ sakku domain:add
Enter your app id: APP-ID
Enter your app domain`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static args = [
    {
      name: 'domain',
      required: false,
      description: 'sakku domain:record:add [domain]',
      hidden: false
    },
    {
      name: 'record',
      required: false,
      description: 'sakku domain:record:add [domain] [record]',
      hidden: false
    },
  ];

  async run() {
    const { args, flags } = this.parse(Add);
    let self = this;
    let result: any;
    let domain: string;
    let record = {};
    let data = {};

    if (args.hasOwnProperty('record') && args.record) {
      record = args.record;
    }
    else {
      record = await cli.prompt(messages.enter_app_id, { required: true });
    }

    if (args.hasOwnProperty('domain') && args.domain) {
      domain = args.domain;
    }
    else {
      domain = await cli.prompt(messages.enter_domain, { required: true });
    }

    try {
      result = await domainService.addRecord(self, domain, record);
      this.log(JSON.stringify(result.data ,null, 2));
    } catch(e) {
      console.log(e);
    }
  }
}
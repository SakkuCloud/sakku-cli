// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { domainService } from '../../../_service/domain.service';
import { messages } from '../../../consts/msg';

export default class All extends Command {
  static description = 'Get records of user domains';

  static examples = [
    `$ sakku domain:record:all`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static args = [
    {
      name: 'domain',
      required: false,
      description: 'sakku domain:add [appId] [domain]',
      hidden: false
    }
  ];

  async run() {
    const { args, flags } = this.parse(All);
    let self = this;
    let domain: String;
    let result: any;

    if (args.hasOwnProperty('domain') && args.domain) {
      domain = args.domain;
    }
    else {
      domain = await cli.prompt(messages.enter_domain, { required: true });
    }
    
    try{
      result = await domainService.getAllRecord(self, domain);
      this.log(result.data);
    }catch(e) {
      console.log(e);
    }
  }
}
// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { domainService } from '../../_service/domain.service';
import { messages } from '../../consts/msg';

export default class Add extends Command {
  static description = 'Add domain';

  static examples = [
    `$ sakku domain:add
Enter your app id: APP-ID
Enter your app domain
Enter certification file ID`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static args = [
    {
      name: 'app',
      required: false,
      description: 'sakku domain:add [appId]',
      hidden: false
    },
    {
      name: 'domain',
      required: false,
      description: 'sakku domain:add [appId] [domain]',
      hidden: false
    },
    {
      name: 'certid',
      required: false,
      description: 'sakku domain:add [appId] [domain] [certid]',
      hidden: false
    },
  ];

  async run() {
    const { args, flags } = this.parse(Add);
    let self = this;
    let result: any;
    let appId: number;
    let domain: string;
    let certid: number;
    let data = {};

    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }

    if (args.hasOwnProperty('domain') && args.domain) {
      domain = args.domain;
    }
    else {
      domain = await cli.prompt(messages.enter_domain, { required: true });
    }

    if (args.hasOwnProperty('certid') && args.certid) {
      certid = args.certid;
    }
    else {
      certid = await cli.prompt(messages.enter_certification_file_id, { required: false });
    }

    data = {
      domain,
      certid
    }
    try {
      result = await domainService.add(self, appId, data);
      this.log(JSON.stringify(result.data ,null, 2));
    } catch(e) {
      console.log(e);
    }
  }
}
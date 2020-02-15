// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { domainService } from '../../_service/domain.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';

export default class Add extends Command {
  static description = 'Add domain';

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
      name: 'app',
      required: false,
      description: 'app id/name',
      hidden: false
    },
    {
      name: 'domain',
      required: false,
      description: 'domain name',
      hidden: false
    },

  ];

  async run() {
    const { args, flags } = this.parse(Add);
    let self = this;
    let result: any;
    let appId: string;
    let domain: string;
    let certid: string;
    let sendObj = {};

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

    if (args.hasOwnProperty('certId') && args.certid) {
      certid = args.certid;
    }
    else {
      certid = await cli.prompt(messages.enter_certification_file_id, { required: false });
    }
    sendObj = {
      appId,
      domain,
      certid
    }
    try {
      result = await domainService.add(self, sendObj);
      this.log(result.data);
    } catch(e) {
      console.log(e);
    }

  }
}
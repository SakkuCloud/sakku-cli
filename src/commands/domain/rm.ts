import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { domainService } from '../../_service/domain.service';
import { messages } from '../../consts/msg';

export default class RM extends Command {
  static description = 'Remove domains of app';

  static examples = [
    `$ sakku domain:rm
Enter your app id: APP-ID
Enter your app domain: DOMAIN
Are you sure to delete this domain? (y or n): y`,
  ];

  static args = [
    {
      name: 'app',
      required: false,
      description: 'sakku domain:rm [appId]',
      hidden: false
    },
    {
      name: 'domain',
      required: false,
      description: 'sakku domain:rm [appId] [domain]',
      hidden: false
    }
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' })
  };

  async run() {
    let self = this;
    let result: any;
    let appId: number;
    let domain: string;
    let data = {};
    const { args, flags } = this.parse(RM);
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

    if (flags.force) {
      await cli.action.start(messages.w8_msg);
      try {
        result = await domainService.rm(self, appId, data);
        this.log(JSON.stringify(result.data ,null, 2));
        cli.action.stop(messages.domain_removed_successfully);
      } catch(e) {
        cli.action.stop(JSON.stringify(e ,null, 2));
      } 
    } 
    else {
      let confimation = await cli.confirm(messages.domain_delete_confirmation);
      if (confimation) {
        await cli.action.start(messages.w8_msg);
        data = {
          domain
        }
        try {
          result = await domainService.rm(self, appId, data);
          this.log(JSON.stringify(result.data ,null, 2));
          cli.action.stop(messages.domain_removed_successfully);
        } catch(e) {
          cli.action.stop(JSON.stringify(e ,null, 2));
        }
      } 
      else {
        this.log(messages.domain_delete_operation_was_canceled);
      }
    }
  }
}
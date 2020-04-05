import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { appService } from '../../../_service/app.service';
import { messages } from '../../../consts/msg';

export default class RM extends Command {
  static description = 'Delete health check by id';

  static examples = [
    `$ sakku helthCheck:rm
Enter your app id: APP-ID
Enter your helth check id: HealthCheck-ID
Are you sure to delete this helthCheck? (y or n): y`,
  ];

  static args = [
    {
      name: 'app',
      required: false,
      description: 'sakku app:healthcheck:rm [appId]',
      hidden: false
    },
    {
      name: 'hid',
      required: false,
      description: 'sakku helthCheck:rm [appId] [hid]', 
      hidden: false
    }
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' }),
    app: flags.string({ char: 'a', description: 'App ID' }),
    hid: flags.string({ char: 'i', description: 'Health Check ID' }),

  };

  async run() {
    let self = this;
    let result: any;
    let appId: string;
    let hId: string;
    let helthCheck: string;

    const { args, flags } = this.parse(RM);

    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else if (flags.hasOwnProperty('app') && flags.app) {
      appId = flags.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }

    if (args.hasOwnProperty('hid') && args.hid) {
      hId = args.hid;
    }
    else if (flags.hasOwnProperty('hid') && flags.hid) {
      hId = flags.hid;
    }
    else {
      hId = await cli.prompt(messages.enter_health_check_id, { required: true });
    }

    if (flags.force) {
      await cli.action.start(messages.w8_msg);
      try {
        result = await appService.rmHealthCheck(self, appId, hId);
        this.log(JSON.stringify(result.data ,null, 2));
        cli.action.stop(messages.helthCheck_remove_success);
      } catch(e) {
        cli.action.stop(JSON.stringify(e ,null, 2));
      } 
    } 
    else {
      let confimation = await cli.confirm(messages.helthCheck_remove_confirm);
      if (confimation) {
        await cli.action.start(messages.w8_msg);
        try {
        result = await appService.rmHealthCheck(self, appId, hId);
          this.log(JSON.stringify(result.data ,null, 2));
          cli.action.stop(messages.helthCheck_remove_success);
        } catch(e) {
          cli.action.stop(JSON.stringify(e ,null, 2));
        }
      } 
      else {
        this.log(messages.helthCheck_remove_cancel);
      }
    }
  }
}
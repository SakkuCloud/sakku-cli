// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { appService } from '../../_service/app.service';
import { common } from '../../utils/common';
import { messages } from '../../consts/msg';

export default class Logs extends Command {
  static description = 'Shows logs of an app';

  static examples = [
    `$ sakku app:logs`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
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
    const { args, flags } = this.parse(Logs);
    let self = this;
    let appId: any;

    let question = {
      name: 'accessLevel',
      message: 'Choose your Access Level: ',
      type: 'list',
      choices: ['VIEW', 'MODERATE', 'MODIFY']
    };

    if (args.hasOwnProperty('app') && args.app) {
      appId = args.app;
    }
    else {
      appId = await cli.prompt(messages.enter_app_id, { required: true });
    }

    let dt = new Date();
    let timestamp = dt.getTime();
    let n = 10; // 10 hours for start
    let interval = 10000; // 10 second interval
    let nHoursAgoTs = timestamp - (n * 60 * 60);
    appService.logs(self, appId, nHoursAgoTs)
      .then(function (result) {
        if (result.data.result.logs) {
          console.log(result.data.result.logs);
        }
        else {
          console.log('Nothing to show!');
        }
        intervalLog();
      })
      .catch(function (err) {
        common.logError(err);
      });

    function intervalLog() {
      setInterval(getandShowLogs, interval);
    }

    function getandShowLogs() {
      appService.logs(self, appId, timestamp)
        .then(function (result) {
          timestamp = (new Date()).getTime();
          if (result.data.result.logs) {
            console.log(result.data.result.logs);
          }
          else {
            console.log('Nothing to show!');
          }
        })
        .catch(function (err) {
          timestamp = (new Date()).getTime();
          common.logError(err);
        });
    }
  }
}

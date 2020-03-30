// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
const WebSocket = require('ws');
const Stomp = require('stompjs');

// Project Modules
import { messages } from '../../consts/msg';
import { common } from '../../utils/common';
import { webSocket_url } from '../../consts/urls';
import { readToken } from '../../utils/read-token';

export default class Stats extends Command {
  static description = 'Realtime app monitoring';
  
  static examples = [
    `$ sakku app:stats
Enter your app id: APP-ID`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    app: flags.string({ char: 'a', description: 'sakku app:stats -a/-app App-ID' }),
  };

  static args = [
    {
      name: 'app',
      required: false,
      description: 'sakku app:stats [App-ID]',
      hidden: false
    },
  ];

  async run() {
    const { args, flags } = this.parse(Stats);
    let appId: string;
    if (args.hasOwnProperty('app') && args.app) {
        appId = args.app;
    }
    else if (flags.hasOwnProperty('app') && flags.app) {
        appId = flags.app;
    }
    else {
        appId = await cli.prompt(messages.enter_app_id, { required: true });
    }

    try {
        const ws = new WebSocket(webSocket_url);
        let stomp = Stomp.over(ws);
        stomp.connect(
          {
            Authorization: readToken(this)
          },
          () => {
            if (stomp && stomp.connected) {
              console.log(messages.connectionSuccess);
              stomp.send("/app/metrics", {}, appId);
              stomp.subscribe(
                "/user/queue/metrics",
                (message) => {
                  try {
                    console.log(JSON.parse(message.body));
                    console.log('\n');
                  } catch (err) {
                    if (!(err instanceof SyntaxError)) {
                    console.log(err);
                    }
                  }
                }
              );
            } else {
              console.log(messages.connectionFail);
            }
          },
          () => {
             console.log('err');
          }
        );
      }
    catch (err) {
      common.logError(err);
    }
  }
}
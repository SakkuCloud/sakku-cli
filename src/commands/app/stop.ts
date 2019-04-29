import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import {appService} from '../../_service/app.service';

export default class Stop extends Command {
  static description = 'stop app';

  static examples = [
    `$ sakku app:stop
  Enter your app-id: APP-ID
  please wait...... stoped!
  your app (APP-ID) is stoped
`,
  ];

  static flags = {
    help: flags.help({char: 'h'})
  };

  async run() {
    const {flags} = this.parse(Stop);
    let appId = await cli.prompt('Enter your app-id', {required: true});
    await cli.action.start('please wait...');
    try {
      await appService.stop(this, appId);
      cli.action.stop('stoped!');
      this.log(`your app (${appId}) is stoped`);
    } catch (err) {
      const code = err.code || (err.response && err.response.status.toString());
      this.log('code:', code, err.response.data.message || '');
    }
  }
}

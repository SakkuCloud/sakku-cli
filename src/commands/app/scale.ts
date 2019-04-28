import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';

export default class Scale extends Command {
  static description = 'scale app';

  static examples = [
    `$ sakku app:scale
Enter your app id: APP-ID
Enter your app scale: 2
please wait...... done!
your app scaled to 2
`,
  ];

  static flags = {
    help: flags.help({char: 'h'})
  };

  async run() {
    const {flags} = this.parse(Scale);
    let appId = await cli.prompt('Enter your app id', {required: true});
    let appScale = await cli.prompt('Enter your app scale', {required: true , type: 'normal'});
    while (isNaN(appScale)) {
      appScale = await cli.prompt('\nEnter your app scale', {required: true , type: 'normal'});
    }
    await cli.action.start('please wait...');
    await cli.wait(2000);
    cli.action.stop('done!');
    this.log(`your app scaled to ${appScale}`);
  }
}

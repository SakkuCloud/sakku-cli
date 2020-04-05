import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

export default class RM extends Command {
  static description = 'Remove app*';

  static examples = [
    `$ sakku app:rm
Enter your app id: APP-ID
are you really sure to remove? (y/n): y`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' })
  };

  async run() {
    const { flags } = this.parse(RM);
    let appId = await cli.prompt('Enter your app id', { required: true });
    if (flags.force) {
      await cli.action.start('please wait...');
      await cli.wait(2000);
      cli.action.stop('removed!');
      this.log('your app is not any more exist in this universe!');
    } 
    else {
      let confimation = await cli.confirm('are you really sure to remove? (y/n)');
      if (confimation) {
        await cli.action.start('please wait...');
        await cli.wait(2000);
        cli.action.stop('removed!');
        this.log('your app is not any more exist in this universe!');
      } 
      else {
        this.log('notting happend!');
      }
    }
  }
}

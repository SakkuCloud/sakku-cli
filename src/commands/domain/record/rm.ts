import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

export default class RM extends Command {
  static description = 'Remove record of domain by name and type that are unique';

  static examples = [
    `$ sakku domain:record:rm
Enter domain: DOMAIN-NAME
Enter name of record: RECORD-NAME
Enter type of record: RECORD-TYPE
are you really sure to remove this record of domain? (y/n): y`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' })
  };
  static args = [
    {
      name: 'domain',
      required: false,
      description: 'domain name',
      hidden: false
    },
    {
      name: 'recordName',
      required: false,
      description: 'recordName name',
      hidden: false
    },
    {
      name: 'recordType',
      required: false,
      description: 'recordType type',
      hidden: false
    },
  ];

  async run() {
    const { flags } = this.parse(RM);
    let domain = await cli.prompt('Enter your app doamin', { required: true });
    let recordName = await cli.prompt('Enter record name', { required: true });
    let recordType = await cli.prompt('Enter record type', { required: true });
    if (flags.force) {
      await cli.action.start('please wait...');
      await cli.wait(2000);
      cli.action.stop('removed!');
      this.log('record of domain is not any more exist in this universe!');
    } 
    else {
      let confimation = await cli.confirm('are you really sure to remove? (y/n)');
      if (confimation) {
        await cli.action.start('please wait...');
        await cli.wait(2000);
        cli.action.stop('removed!');
        this.log('record of domain is not any more exist in this universe!');
      } 
      else {
        this.log('notting happend!');
      }
    }
  }
}

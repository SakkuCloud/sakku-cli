// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { domainService } from '../../_service/domain.service';

export default class All extends Command {
  static description = 'Get all domains of user';

  static examples = [
    `$ sakku domain:all`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  async run() {
    const { args, flags } = this.parse(All);
    let self = this;
    let result: any;
    try{
      result = await domainService.all(self);
      this.log(JSON.stringify(result.data ,null, 2));
    }catch(e) {
      console.log(e);
    }
  }
}
// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { domainService } from '../../_service/domain.service';

export default class getAll extends Command {
  static description = 'Get all domains of user';

  static examples = [
    `$ sakku domain:getAll`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  async run() {
    const { args, flags } = this.parse(getAll);
    let self = this;
    let result: any;
    try{
      result = await domainService.getAll(self);
      this.log(result.data);
    }catch(e) {
      console.log(e);
    }
  }
}
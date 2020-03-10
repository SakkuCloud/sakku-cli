// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { networkService } from '../../_service/network.service';
import { messages } from '../../consts/msg';

export default class All extends Command {
  static description = 'Get all networks';

  static examples = [
    `$ sakku network:all`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };


  async run() {
    const { args, flags } = this.parse(All);
    let self = this;
    let network: String;
    let result: any;
    
    try{
      result = await networkService.all(self);
      this.log(result.data);
    }catch(e) {
      console.log(e);
    }
  }
}
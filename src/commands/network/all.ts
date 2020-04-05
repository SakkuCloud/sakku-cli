// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { networkService } from '../../_service/network.service';

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
    let result: any;
    
    try{
      result = await networkService.all(self);
      this.log(JSON.stringify(result.data ,null, 2));
    }catch(e) {
      console.log(e);
    }
  }
}
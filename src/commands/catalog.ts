// External Modules
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
import { Tree } from 'cli-ux/lib/styled/tree';

// Project Modules
import { catalogService } from '../_service/catalog.service';

export default class Whoami extends Command {
  static description = 'List all different Program Catalogs';

  static examples = [
    `$ sakku catalog`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  async run() {
    this.log(catalogService);
    let result;
    // catalogService.getAll(this)
    // .then(function (result) {
    //   this.log(result);
    // })
    // .catch(function(err){
    //   this.log(err);
    // })

    result = await catalogService.getAll(this);
    // console.log(result);

  }
}

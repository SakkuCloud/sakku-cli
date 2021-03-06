// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { writeZone } from  '../../utils/writer';
import { messages } from '../../consts/msg';
import color from '@oclif/color';

export default class Set extends Command {
  static description = 'zone:set';

  static examples = [
    `$ sakku zone:set
    Choose datacenter zone : (Use arrow keys)
    > serverius : Serverius Datacenter in holland
      khatam : Khatam University Datacenter in Tehran
    $ sakku zone:set --zone khatam | serverius
      `,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    zone: flags.string({char: 'z', options: ['serverius', 'khatam']})
  };

  async run() {
    const { flags } = this.parse(Set);
    let self = this;
    let zone: string;
    if (flags.hasOwnProperty('zone') && flags.zone) {
      zone = flags.zone;
    }
    else {
      let response: any = await inquirer.prompt([{
        name: 'zone',
        message: messages.choose_datacenter_zone,
        type: 'list',
        choices: [
          {name: 'serverius : Serverius Datacenter in holland', value: 'serverius'},
          {name: 'khatam : Khatam University Datacenter in Tehran', value: 'khatam'}
        ],
        default : 'serverius'
      }]);
      zone = response.zone;
    }
    try {
    writeZone(self, zone);
    this.log(color.green(zone == 'khatam' ? messages.zone_is_set_to_khatam : messages.zone_is_set_to_serverius));
    }
    catch (e) {
      this.log(e);
    }
  }
}
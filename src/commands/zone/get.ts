// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { readDatacenterZone } from  '../../utils/read-datacenter-zone';
import { messages } from '../../consts/msg';

export default class Get extends Command {
  static description = 'zone:get';

  static examples = [
    `$ sakku zone:get`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    let zone: string;
    try {
      zone = readDatacenterZone(this);
      let zoneMessage = zone == 'khatam' ? '- Khatam University Datacenter in Tehran' : '- Serverius Datacenter in holland';
      console.log(zoneMessage);
    } catch(e) {
      console.log(e);
    }
  }
}
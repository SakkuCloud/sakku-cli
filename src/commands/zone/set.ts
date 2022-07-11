// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { writeUrlInfo } from  '../../utils/writer';
import { messages } from '../../consts/msg';
import color from '@oclif/color';
import { authService } from '../../_service/auth.service';
import { IZoneInfo } from '../../interfaces/auth.interface';
import { common } from '../../utils/common';

export default class Set extends Command {
  static description = 'zone:set';

  static examples = [
    `$ sakku zone:set
    Choose datacenter zone : (Use arrow keys)
    > serverius : Serverius Datacenter in holland
7      sandbox : Sandbox Datacenter in Tehran
      khatam : Khatam University Datacenter in Tehran
      pardis : Pardis Datacenter in Tehran
    $ sakku zone:set --zone khatam | serverius | pardis | sandbox
      `,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    zone: flags.string({char: 'z', options: ['serverius', 'khatam', 'pardis', 'sandbox']})
  };

  async run() {
    const { flags } = this.parse(Set);
    let self = this;
    let zone: string;
    let datacenterInfoList: IZoneInfo[] | undefined;
    let datacenterQuestionList = await authService.getZoneInfo()
     .then((result) => {
        datacenterInfoList = result.data.result;
        return datacenterInfoList;
    }).then((result) => {
      return createDatacenterQuestionList(result ? result : []);
    });

    function createDatacenterQuestionList(zoneList: IZoneInfo[]) {
      let question:
        {
          name: string,
          message: string,
          type: string,
          choices: { name: string, value: string }[],
          default: string,
        } = {
          name: 'zone',
          message: messages.choose_datacenter_zone,
          type: 'list',
          choices: [],
          default : 'serverius'
      };

      for (let zone of zoneList) {
        question.choices.push({
          name: '- ' + zone.name + ' : ' + zone.description,
          value: zone.name
        });
      }

      return question;
    }

    if (flags.hasOwnProperty('zone') && flags.zone) {
      zone = flags.zone;
    }
    else {
      let response: any = await inquirer.prompt(datacenterQuestionList);
      zone = response.zone;
    }
    try {
    let selectedDatacenterInfo = datacenterInfoList?.find((datacenterInfo) => datacenterInfo.name.toLowerCase() === zone.toLowerCase());
    if (selectedDatacenterInfo) {
      writeUrlInfo(self, selectedDatacenterInfo);
    }
    this.log(color.green(messages.zone_is_set_to_datacenter + selectedDatacenterInfo?.description));
    }
    catch (e) {
      common.logError(e);
    }
  }
}

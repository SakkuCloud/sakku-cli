// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';

// Project Modules
import { appService } from '../../../_service/app.service';
import { common } from '../../../utils/common';
import { messages } from '../../../consts/msg';

export default class Update extends Command {
  static description = 'Update record of user domains';

  static examples = [
    `$ sakku domain:record:update
Enter domain: DOMAIN-NAME
Enter name of record: RECORD-NAME
Enter type of record: RECORD-TYPE`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

//   static args = [
//     {
//       name: 'app',
//       required: false,
//       description: 'app id/name',
//       hidden: false
//     },
//   ];

  async run() {
    let cid: string;
    let colData = {
      accessLevel: 'VIEW',
      email: '',
      imageRegistry: ''
    }
    cli.prompt(messages.enter_col_id, { required: true })
      .then(function (answer) {
        cid = answer;
        return cli.prompt(messages.enter_col_email, { required: true })
      })
      .then(answer => {
        colData.email = answer;
        return inquirer.prompt([question])
      })
      .then(function (answer) {
        // @ts-ignore
        colData.accessLevel = answer;
        return cli.prompt(messages.enter_col_image_reg, { required: false });
      })
      .then(function (answer) {
        colData.imageRegistry = answer;
        return appService.editCollaborator(self, appId, cid, colData)
      })
      .then(result => {
        console.log(messages.col_edit_success);
      })
      .catch(function (err) {
        common.logError(err);
      })
  }
}
// External Modules
import color from '@oclif/color';
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';
const opn = require('open');

// Project Modules
import { authService } from '../_service/auth.service';
import { messages } from '../consts/msg';
import makeId from '../utils/make-id';
import { writeOverview, writeToken } from '../utils/writer';
import { common } from '../utils/common';
import { getPanelUrl } from '../utils/get-urls-based-zone';
import { auth_url } from '../consts/urls';

export default class Login extends Command {
  static description = 'Login to Sakku cli interface.';

  static examples = [
    `$ sakku login
? there are two ways you can login: (Use arrow keys)
${color.cyan('❯ Login by Api Token')}
  Login by Browser`
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  async run() {
    let apiToken: string = '';
    let panelAuthUrl = getPanelUrl(this) + '/' + auth_url;
    const question = {
      name: 'way',
      message: 'There are two ways you can login:',
      type: 'list',
      choices: [{ name: 'Login by Api Token' }, { name: 'Login by Browser' }]
    };

    const maxRepeat: number = 30;    // for login with browser
    const waitTime: number = 5000;   // for login with browser
    const code = makeId();           // for login with browser
    const answer: { way: string } = await inquirer.prompt([question]);

    if (answer.way === question.choices[0].name) { // login with api token
      apiToken = await cli.prompt(messages.api_token_req, { required: true, type: 'hide' });
      try {
        // let data = (await authService.login(this, user)).data;   // sends user credentials to the server
        await writeToken(this, { token: apiToken });    // write the access token in the file
        let value = await authService.overview(this);      // sends request the get the user's config
        let overview = JSON.stringify(value.data.result);
        await writeOverview(this, overview);                // write the user's config to the file
        console.log(color.green(messages.loggedin));
      }
      catch (e) {
        common.logError(e);
      }
    }
    else { // login with browser
      try {
        await opn(`${panelAuthUrl}${code}`, { wait: false });
      }
      catch (e) {
        cli.url(`${color.green(messages.click_here_to_login_msg)}`, `${panelAuthUrl}${code}`);
      }
      cli.action.start(messages.tryToLog);
      await cli.wait(waitTime);
      let isLoggedin = false;
      let repeatedCount = 0;

      while (!isLoggedin) {
        await cli.wait(waitTime);
        try {
          let resp = await authService.authenticate(this, code);
          await writeToken(this, { token: resp.data.result });
          isLoggedin = true;
        }
        catch (e) {
          console.log('====================>', e, '<=====================');
          if (repeatedCount > maxRepeat) {
            console.log(color.red(messages.problem_in_login_msg));
            break;
          }
          repeatedCount++;
        }
      }

      if (isLoggedin) {
        try {
          let value = await authService.overview(this);
          let overview = JSON.stringify(value.data.result);
          writeOverview(this, overview);
        }
        catch (e) {
          common.logError(e);
        }
        cli.action.stop(messages.done_msg);
        console.log(color.green(messages.loggedin));
      }
      else {
        cli.action.stop(messages.abort_msg);
      }
    }
  }
}

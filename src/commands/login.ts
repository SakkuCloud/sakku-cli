// External Modules
import color from '@oclif/color';
import { Command, flags } from '@oclif/command';
import { AxiosError } from 'axios';
import cli from 'cli-ux';
import * as inquirer from 'inquirer';
let opn = require('opn');

// Project Modules
import { authService } from '../_service/auth.service';
import {
  abort_msg,
  click_here_to_login_msg,
  done_msg,
  password_req,
  problem_in_login_msg,
  username_req
} from '../consts/msg';
import { auth_url } from '../consts/urls';
import { usernameDomain } from '../consts/val';
import makeId from '../utils/make-id';
import { writeOverview, writeToken } from '../utils/writer';

export default class Login extends Command {
  static description = 'login to Sakku cli interface.';

  static examples = [
    `$ sakku login
? there is two way you can login: (Use arrow keys)
${color.cyan('❯ Login by Username & Password')}
  Login by Browser`
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  static user = { username: '', password: '' };

  static question = {
    name: 'way',
    message: 'There are two ways you can login:',
    type: 'list',
    choices: [{ name: 'Login by Username & Password' }, { name: 'Login by Browser' }],
  };

  async run() {
    const code = makeId();
    inquirer.prompt([Login.question])
      .then(answers => {
        // @ts-ignore
        switch (answers.way) {
          case Login.question.choices[0].name: // login with username & password
            cli.prompt(username_req, { required: true })
              .then(user => {
                /*if (user.indexOf('@') === -1) {
                  user += usernameDomain;
                }*/
                Login.user.username = user;
              })
              .then(() => {
                cli.prompt(password_req, { required: true, type: 'hide' })
                  .then(pass => {
                    Login.user.password = pass;
                  })
                  .then(() => {
                    authService.login(Login.user)
                      .then(value => value.data)
                      .then(data => {
                        if (data.error) {
                          this.log(data.message);
                        }
                        else {
                          writeToken(this, { token: data.result })
                            .then(() => {
                              try {
                                authService.overview(this)
                                  .then(value => JSON.stringify(value.data.result))
                                  .then(overview => {
                                    writeOverview(this, overview)
                                      .catch(err => {
                                        this.log(err);
                                      });
                                  })
                                  .catch(err => {
                                    this.log(err.code || (err.response && err.response.status.toString()));
                                  });
                              }
                              catch (e) {
                                this.log(e);
                              }
                              this.log(color.green("you're logged in"));
                            })
                            .catch(e => {
                              this.log(e);
                            });
                        }
                      })
                      .catch((err: AxiosError) => {
                        const code = err.code || (err.response && err.response.status.toString());
                        switch (code) {
                          // tslint:disable ter-indent
                          case '403':
                          case '400':
                            this.log('Incorrect username or password');
                            break;
                          default:
                            if (err.response && err.response.data) {
                              this.log('An error occured!', code + ':', err.response.data.message || '');
                            }
                            else if (err.response && err.response.statusText) {
                              this.log('An error occured!', code + ':', err.response.data.statusText || '');
                            }
                            else {
                              this.log('An error occured!', code);
                            }
                        }
                      });
                  });
              });
            break;
          case Login.question.choices[1].name: // login with browser
            opn(`${auth_url}${code}`, { wait: false })
              .catch(() => {
                cli.url(`${color.green(click_here_to_login_msg)}`,
                  `${auth_url}${code}`);
              })
              .then(async () => {
                cli.action.start('logging in to Sakku...');
                await cli.wait(5000);
                let isLoggedin = false;
                let repeatedCount = 0;
                while (!isLoggedin) {
                  await cli.wait(5000);
                  try {
                    let resp = await authService.authenticate(code);
                    writeToken(this, { token: resp.data.result });
                    isLoggedin = true;
                  }
                  catch {
                    if (repeatedCount > 10) {
                      this.log(color.red(problem_in_login_msg));
                      break;
                    }
                    repeatedCount++;
                  }
                }
                if (isLoggedin) {
                  try {
                    let overview = await authService.overview(this).then(value => JSON.stringify(value.data.result));
                    writeOverview(this, overview);
                  }
                  catch (e) {
                    this.log(e);
                  }
                  cli.action.stop(done_msg);
                  this.log(`${color.green('you are logged in :)')}`);
                }
                else {
                  cli.action.stop(abort_msg);
                }
              });
        }
      });
  }
}

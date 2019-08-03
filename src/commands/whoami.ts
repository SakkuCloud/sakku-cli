// External Modules
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
import { Tree } from 'cli-ux/lib/styled/tree';

// Project Modules
import { authService } from '../_service/auth.service';

export default class Whoami extends Command {
  static description = 'Shows username or complete user info and stats';

  static examples = [
    `$ sakku whoami`,
    `$ sakku whoami -c`
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    complete: flags.boolean({ char: 'c' })
  };

  async run() {
    const { flags } = this.parse(Whoami);

    try {
      this.log('Please Wait ...');
      const res = await authService.overview(this);
      const data = res.data.result;
      if (data) {
        if (flags.complete) {
          generateTree(data).display();
        }
        else {
          // @ts-ignore
          this.log(data.user.username);
        }
      }
      else {
        this.log('Unexpected Error');
      }
    }
    catch (e) {
      if (typeof e === 'object' && e.hasOwnProperty('code') && e.code === 'ENOENT') {
        this.log('You are not logged in. Please Login with your credentials.');
      }
      else if (typeof e.response === 'object' && e.hasOwnProperty('status')) {
        this.log('Can not fetch user data from server, error code is: ', e.response.status, 'Please try later. If the error persists, log in again');
      }
      else if (typeof e === 'object' && e.hasOwnProperty('code')) {
        this.log('There is a problem! error Code is: ', e.code, 'If the error persists, log in again');
      }
    }
  }
}

function generateTree(data: { [key: string]: any }): Tree {
  let tree = cli.tree();
  for (let p1 of Object.keys(data)) {
    if (data[p1] && typeof data[p1] === 'object') {
      tree.insert(p1, generateTree(data[p1]));
    } else {
      tree.insert(p1);
      tree.nodes[p1].insert(data[p1]);
    }
  }
  return tree;
}

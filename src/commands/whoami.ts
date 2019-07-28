// External Modules
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
import { Tree } from 'cli-ux/lib/styled/tree';

// Project Modules
import { authService } from '../_service/auth.service';

export default class Whoami extends Command {
  static description = 'Shows user info and stats';

  static examples = [
    `$ sakku whoami
    `,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  async run() {
    const { flags } = this.parse(Whoami);
    try {
      const res = await authService.overview(this);
      await cli.action.start('please wait...');
      const data = res.data.result;
      if (data) {
        generateTree(data).display();
      }
    } catch (e) {
      if (typeof e === 'object' && e.hasOwnProperty('code') && e.code === 'ENOENT') {
        this.log('Login with your credentials.');
      }
      else if (typeof e === 'object' && e.hasOwnProperty('code')) {
        this.log('There is a problem! Error Code is: ', e.code);
      }
      else {
        this.log('There is a problem: ', e.response && e.response.status);
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

// External Modules
import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
import { Tree } from 'cli-ux/lib/styled/tree';

// Project Modules
import { authService } from '../_service/auth.service';
import { messages } from '../consts/msg';
import { common } from '../utils/common';

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

    this.log(messages.w8_msg);
    try {
      const res = await authService.overview(this);
      const data = res.data.result;
      if (data) {
        if (flags.complete) {
          generateTree(data).display();
        }
        else if (data.user) {
          this.log(data.user.username);
        }
        else {
          this.log(messages.unexpected);
        }
      }
      else {
        this.log(messages.unexpected);
      }
    }
    catch (e) {
      common.logError(e);
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

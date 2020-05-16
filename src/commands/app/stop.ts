import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import {appService} from '../../_service/app.service';
import { messages } from '../../consts/msg';

export default class Stop extends Command {
  static description = 'stop app';

  static examples = [
    `$ sakku app:stop
  Enter your app-id: APP-ID
  please wait...... stopped!
  your app (APP-ID) is stoped
`,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
    commit: flags.boolean({ char: 'c', description: 'Commit Application Status Before Stop'}),
    force: flags.boolean({ char: 'f', description: 'Force to Stop Application'}),
    tag: flags.string({ char: 't', description: 'Version of Application', dependsOn:['commit']}),
  };

  async run() {
    const {flags} = this.parse(Stop);
    let commit = false;
    let force = false;
    let tag = '';

    let appId = await cli.prompt(messages.enter_app_id, {required: true});
    // commit
    if (flags.hasOwnProperty('commit') && flags.commit) {
      commit = true;
    }
    else {
      commit = await cli.confirm(messages.commit_app);
    }

    if (commit) {
      // version of application
      if (flags.hasOwnProperty('tag') && flags.tag) {
        tag = flags.tag;
      }
      else {
        tag = await cli.prompt(messages.enter_tag_for_commit, { required: false });
      }
    }
    

    // force stop
    if (flags.hasOwnProperty('force') && flags.force) {
      force = true;
    }
    else {
      force = await cli.confirm(messages.force_stop_app);
    }

    let data = {
      commit,
      force,
      tag
    }
    await cli.action.start('please wait...');
    try {
      await appService.stop(this, appId, data);
      cli.action.stop('stoped!');
      this.log(`your app (${appId}) is stoped`);
    } catch (err) {
      const code = err.code || (err.response && err.response.status.toString());
      this.log('code:', code, err || '');
    }
  }
}

// External Modules
import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';

// Project Modules
import { appService } from '../../_service/app.service';


export default class Scale extends Command {
  static description = 'scale app';

  static examples = [
    `$ sakku app:scale
Enter your app id: APP-ID
Enter your app scale: 2
your app scaled to 2
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' })
  };

  async run() {
    const { flags } = this.parse(Scale);
    let self = this;
    let appData;
    let appId = await cli.prompt('Enter your app id', { required: true });

    appService.get(this, appId)
      .then(function (result) {
        // @ts-ignore
        appData = result.data.result;
        // @ts-ignore
        let scalingMode = appData.configuration.scalingMode;
        if (scalingMode.toLowerCase() === 'and') {
          scalingMode = 'CPU and MEM'
        } 
        else if(scalingMode.toLowerCase() === 'or') {
          scalingMode = 'CPU or MEM'
        }
        console.log('Your Current Scaling Mode is: ', scalingMode);
        console.log('Your Current Scaling Mode is: ', scalingMode);
      })
      .catch(function (err) {
        const code = err.code || (err.response && err.response.status.toString());
        if (err.response && err.response.data) {
          console.log('An error occured!', code + ':', err.response.data.message || '');
        }
        else if (err.response && err.response.statusText) {
          console.log('An error occured!', code + ':', err.response.data.statusText || '');
        }
        else if (code === 'ENOENT') {
          console.log('An error occured!', 'You are not logged in');
        }
        else {
          console.log('An error occured!', code);
        }
      });

    // let appScale = await cli.prompt('Enter your app scale', { required: true, type: 'normal' });
    // while (isNaN(appScale)) {
    //   appScale = await cli.prompt('\nEnter your app scale', { required: true, type: 'normal' });
    // }
    // await cli.action.start('please wait...');
    // await cli.wait(2000);
    // cli.action.stop('done!');
    // this.log(`your app scaled to ${appScale}`);
  }
}

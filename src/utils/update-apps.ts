// External Modules
import {Command} from '@oclif/command';

// Project Modules
import {appService} from '../_service/app.service';
import {writeApps} from './writer';

export default async function (ctx: Command) {
  try {
    const data = await appService.list(ctx);
    writeApps(ctx, data);
  } 
  catch (_) {
  }
}

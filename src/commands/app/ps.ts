import {Command, flags} from '@oclif/command';
import {cli} from 'cli-ux';
import {appService} from '../../_service/app.service';
import {IAppsAccess, IAppsPort} from '../../interfaces/app.interface';
import {writeApps} from '../../utils/writer';

export default class PS extends Command {
  static description = 'showing all [running/all] app';

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({char: 'a', description: 'show all apps'}),
  };

  async run() {
    const {flags} = this.parse(PS);
    try {
      let data = await appService.list(this);
      writeApps(this, data);
      cli.table(data, {
        columns: [{
          key: 'id',
          label: 'ID'
        }, {
          key: 'name',
          label: 'Name'
        }, {
          key: 'created',
          label: 'Create Time'
        }, {
          key: 'ports',
          label: 'PORT',
          get: (row: any) => row.ports && row.ports.host && row.ports.map((port: IAppsPort) => port.host + '-' + port.container)
            .filter((ports: IAppsPort) => ports).join('-') || '-'
        }, {
          key: 'deployType',
          label: 'TYPE',
          get: (row: any) => row.deployType ? row.deployType : '-'
        }, {
          key: 'access',
          label: 'Access',
          get: (row: any) => row.access && typeof row.access === 'object' && row.access.map((access: IAppsAccess) =>
            access.person ?
              access.person.firstName ?
                access.person.firstName +
                access.person.lastName ? ' ' + access.person.lastName : '' :
                access.person.username :
              null).filter((access: IAppsAccess) => access)
            .join(' ') || 'No Collaboration'
        }],
        colSep: ' | '
      });
    } catch (err) {
      this.log(err.response.data.error);
    }
  }
}

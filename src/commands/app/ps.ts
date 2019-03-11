import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux'
import {__values} from 'tslib'
import {appService} from '../../_service/app.service'
import {IApp, IAppsAccess, IAppsPort} from '../../interfaces/app.interface'
import {writeApps} from '../../utils/writer'

export default class PS extends Command {
  static description = 'showing all [running/stoped] app'

  static examples = [
    '$ sakku app:ps [-a,--all]',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    all: flags.boolean({char: 'a'}),
  }

  async run() {
    const {flags} = this.parse(PS)
    try {
      let data = await appService.list(this)
      writeApps(this, data)
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
      })
    } catch (err) {
      this.log(err.response.data.error)
    }
    // if (flags.all) {
    //   cli.action.start('please wait...')
    //   await cli.wait(2000)
    //   cli.action.stop('done')
    //   this.log('showing all apps')
    // } else {
    //   cli.action.start('please wait...')
    //   await cli.wait(2000)
    //   cli.action.stop('done')
    //   this.log('showing all running apps')
    // }
  }
}

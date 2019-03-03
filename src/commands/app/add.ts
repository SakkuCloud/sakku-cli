import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
import {isNumeric} from 'tslint'

import {appService} from '../../_service/app.service'
import {
  abort_msg,
  done_msg,
  enter_your_app_name_msg, enter_your_app_port_msg,
  enter_your_args_msg,
  enter_your_cmd_msg,
  enter_your_disk_msg, enter_your_environment_key_msg,
  enter_your_environment_value_msg,
  enter_your_host_port_msg, enter_your_link_alias_msg,
  enter_your_link_name_msg,
  enter_your_max_core_msg,
  enter_your_max_core_per_instance_msg,
  enter_your_max_instance_msg,
  enter_your_max_ram_msg,
  enter_your_max_ram_per_instance_msg,
  enter_your_min_core_msg,
  enter_your_min_core_per_instance_msg,
  enter_your_min_instance_msg,
  enter_your_min_ram_msg,
  enter_your_min_ram_per_instance_msg,
  w8_msg
} from '../../consts/msg'
import {writeApps} from '../../utils/write-to-file'

export default class Add extends Command {
  static description = 'add new app'

  static examples = [
    '$ sakku app:add',
  ]
  static port = {name: '', alias: ''}
  static flags = {
    help: flags.help({char: 'h'})
  }

  async run() {
    let name
    do {
      name = await cli.prompt(enter_your_app_name_msg, {required: true})
    } while (!isNumeric(name))
    let minRam = await cli.prompt(enter_your_min_ram_msg, {required: true})
    let maxRam = await cli.prompt(enter_your_max_ram_msg, {required: true})
    let minCore = await cli.prompt(enter_your_min_core_msg, {required: true})
    let maxCore = await cli.prompt(enter_your_max_core_msg, {required: true})
    let disk = await cli.prompt(enter_your_disk_msg, {required: true})
    let minRamPerInstance = await cli.prompt(enter_your_min_ram_per_instance_msg, {required: true})
    let maxRamPerInstance = await cli.prompt(enter_your_max_ram_per_instance_msg, {required: true})
    let minCorePerInstance = await cli.prompt(enter_your_min_core_per_instance_msg, {required: true})
    let maxCorePerInstance = await cli.prompt(enter_your_max_core_per_instance_msg, {required: true})
    let minInstance = await cli.prompt(enter_your_min_instance_msg, {required: true})
    let maxInstance = await cli.prompt(enter_your_max_instance_msg, {required: true})
    let cmd = await cli.prompt(enter_your_cmd_msg, {required: true})

    let args = []
    do {
      args.push(await cli.prompt(enter_your_args_msg))
    } while (await cli.confirm('is there other args any more?'))

    let ports = []
    do {
      Add.port.name = await cli.prompt(enter_your_host_port_msg)
      Add.port.alias = await cli.prompt(enter_your_app_port_msg)
      ports.push(Add.port)
    } while (await cli.confirm('is there other ports any more?'))

    let links = []
    do {
      let param: string = await cli.prompt(enter_your_link_name_msg)
      let value: string = await cli.prompt(enter_your_link_alias_msg)
      links.push({[param]: value})
    } while (await cli.confirm('is there other labels any more?'))

    let environments = []
    do {
      let param: string = await cli.prompt(enter_your_environment_key_msg)
      let value: string = await cli.prompt(enter_your_environment_value_msg)
      environments.push({[param]: value})
    } while (await cli.confirm('is there other environments any more?'))

    let labels = []
    do {
      let param: string = await cli.prompt(enter_your_environment_key_msg)
      let value: string = await cli.prompt(enter_your_environment_value_msg)
      labels.push({[param]: value})
    } while (await cli.confirm('is there other labels any more?'))
    let response = await appService.create(this, {
      name,
      minRam,
      maxRam,
      minCore,
      maxCore,
      disk,
      minRamPerInstance,
      maxRamPerInstance,
      minCorePerInstance,
      maxCorePerInstance,
      minInstance,
      maxInstance,
      cmd,
      args,
      labels,
      ports,
      links,
      environments
    })
    this.log(response)
    await cli.action.start(w8_msg)
    try {
      await fs.mkdirSync(name)
      await fs.realpath(name, (_, resolvedPath) => {
        writeApps(this, `${name}:'${resolvedPath}'`)
      })
      cli.action.stop(done_msg)
      this.log(`${name} is ready to deploy :)`)
    } catch (_) {
      cli.action.stop(abort_msg)
      this.log('folder name already exist!!')
    }
  }
}

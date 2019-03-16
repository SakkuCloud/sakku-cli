import Command from '@oclif/command'
import * as fs from 'fs'
import * as FTP from 'promise-ftp'
import * as tar from 'tar'
import {readConfig} from '../utils/read-token'

export default async function deploySrc(ctx: Command, appName: string) {
  const ftp = new FTP()
  let date = new Date()
  let config = await JSON.parse(readConfig(ctx))
  let filename = 'src_' + appName + '_' + date.getTime().toString() + '.tgz'
  return tar.create(
    {
      gzip: true,
      file: filename
    },
    [fs.realpathSync('./')]
  ).then(_ => {
    ftp.connect({host: config.ftp.host, user: config.ftp.username, password: config.ftp.password, port: config.ftp.port})
      .then(_ => {
        return ftp.put(filename, `/${filename}`)
      }).then(_ => {
        fs.unlink(filename, _ => {
          return ftp.end()
        })
      })
  })
}

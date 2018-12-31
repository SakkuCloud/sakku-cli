import * as fs from 'fs'
import * as path from 'path'
import * as FTP from 'promise-ftp'
import * as tar from 'tar'

export default async function deploySrc(ctx: any, appName: string) {
  const ftp = new FTP()
  let date = new Date()
  let config = await JSON.parse(fs.readFileSync(path.join(ctx.config.cacheDir, 'config.json'), {encoding: 'utf-8'}))
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

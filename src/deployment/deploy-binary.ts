import * as fs from 'fs';
import * as path from 'path';
import * as FTP from 'promise-ftp';

export default async function deployBinary(ctx: any, filePath: string, appName: string) {
  const ftp = new FTP();
  let date = new Date();
  let file = await fs.readFileSync(filePath);
  let extention = await path.extname(filePath);
  let config = await JSON.parse(fs.readFileSync(path.join(ctx.config.cacheDir, 'config.json'), {encoding: 'utf-8'}));
  let filename = 'bin_' + appName + '_' + date.getTime().toString();
  ftp.connect({host: config.ftp.host, user: config.ftp.username, password: config.ftp.password, port: config.ftp.port})
    .then(_ => {
      return ftp.put(file, `/${filename}${extention}`);
    }).then(_ => {
      fs.unlink(filename, _ => {
        return ftp.end();
      });
    });
}

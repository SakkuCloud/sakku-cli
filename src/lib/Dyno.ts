import {cli} from 'cli-ux'
import {Duplex, Transform} from 'stream'
import * as tty from 'tty'

class Dyno extends Duplex {
  private opts: any
  constructor(opts) {
    super()
    this.cork()
    this.opts = opts
  }

  _read(size: number): void {
  }

  _write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
  }

  _readData(c) {
    let firstLine = true
    return data => {
      // discard first line
      if (c && firstLine) {
        if (this.opts.showStatus) cli.action.done(this._status('up'))
        firstLine = false
        this._readStdin(c)
        return
      }

      // carriage returns break json parsing of output
      // eslint-disable-next-line
      if (!process.stdout.isTTY) data = data.replace(new RegExp('\r\n', 'g'), '\n')

      let exitCode = data.match(/\uFFFF heroku-command-exit-status: (\d+)/m)
      if (exitCode) {
        this.push(data.replace(/^\uFFFF heroku-command-exit-status: \d+$\n?/m, ''))
        let code = parseInt(exitCode[1])
        if (code === 0) this.resolve()
        else {
          let err = new Error(`Process exited with code ${cli.color.red(code)}`)
          err.exitCode = code
          this.reject(err)
        }
        return
      }
      this.push(data)
    }
  }

  _readStdin(c) {
    this.input = c
    let stdin = process.stdin
    stdin.setEncoding('utf8')

    // without this the CLI will hang on rake db:migrate
    // until a character is pressed
    if (stdin.unref) stdin.unref()

    if (!this.opts['no-tty'] && tty.isatty(0)) {
      stdin.setRawMode(true)
      stdin.pipe(c)
      let sigints = []
      stdin.on('data', function (c) {
        if (c === '\u0003') sigints.push(new Date())
        sigints = sigints.filter(d => d > new Date() - 1000)
        if (sigints.length >= 4) {
          cli.error('forcing dyno disconnect')
          process.exit(1)
        }
      })
    } else {
      stdin.pipe(new Transform({
        objectMode: true,
        transform: (chunk, _, next) => c.write(chunk, next),
        flush: done => c.write('\x04', done)
      }))
    }
    this.uncork()
  }

  _read() {
    if (this.useSSH) {
      throw new Error('Cannot read stream from ssh dyno')
    }
    // do not need to do anything to handle Readable interface
  }

  _write(chunk, encoding, callback) {
    if (this.useSSH) {
      throw new Error('Cannot write stream to ssh dyno')
    }
    if (!this.input) throw new Error('no input')
    this.input.write(chunk, encoding, callback)
  }
}

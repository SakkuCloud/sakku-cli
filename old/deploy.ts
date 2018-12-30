import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'

import checkLang from '../old/check-lang'

export default class Deploy extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ sakku hello
hello world from ./src/hello.ts!
`,
  ]

  static langs = {
    Java: 0,
    Python: 0,
    JavaScript: 0,
    PHP: 0,
    Go: 0,
    Ruby: 0,
    CSS: 0,
    HTML: 0,
    C: 0
  }

  static langnum = [0, 0, 0, 0, 0, 0, 0, 0, 0]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  async run() {
    let dir = path.resolve('./')
    let langnum = checkLang(dir)
    let maxIndex = langnum[0]
    let maxVal = langnum[0]
    langnum.forEach((value, index) => {
      if (maxVal < value) {
        maxVal = value
        maxIndex = index
      }
    })
    switch (maxIndex) {
    case 0:
      this.log('java')
      break
    case 1:
      this.log('python')
      break
    case 2:
      this.log('js')
      break
    case 3:
      this.log('php')
      break
    case 4:
      this.log('go')
      break
    case 5:
      this.log('ruby')
      break
    case 6:
      this.log('css')
      break
    case 7:
      this.log('html')
      break
    case 8:
      this.log('c')
    }
  }
}

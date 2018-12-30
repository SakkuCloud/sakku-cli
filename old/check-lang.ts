import {string} from '@oclif/command/lib/flags'
import * as fs from 'fs'

let detectLang = require('lang-detector')

export default function checkLang(dir: string): number[] {
  let langnum = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  // @ts-ignore
  fs.readdirSync(dir, {withFileTypes: false, encoding: 'utf-8'}).forEach(name => {
    let f = fs.lstatSync(dir + '/' + name)
    if (f.isFile()) {
      const file = dir + '/' + name
      let fileType = detectLang(fs.readFileSync(file, {encoding: 'utf-8'}))
      switch (fileType) {
      case 'Java':
        langnum[0]++
        break
      case 'Python':
        langnum[1]++
        break
      case 'JavaScript':
        langnum[2]++
        break
      case 'PHP':
        langnum[3]++
        break
      case 'Go':
        langnum[4]++
        break
      case 'Ruby':
        langnum[5]++
        break
      case 'CSS':
        langnum[6]++
        break
      case 'HTML':
        langnum[7]++
        break
      case 'C':
        langnum[8]++
        break
      case 'C++':
        langnum[8]++
      }
    } else if (f.isDirectory()) {
      let temp = checkLang(dir + '/' + name)
      temp.forEach((value, index) => {
        langnum[index] += value
      })
    }
  })
  // ( files) => {
  //   for (const name of files) {
  //     fs.lstat(dir + '/' + name, ((err1, stats) => {
  //       if (stats.isFile()) {
  //         let file = dir + '/' + name
  //         fs.readFile(file, {encoding: 'utf-8'}, (err2, data) => {
  //           console.log(detectLang(data.toString()))
  //           switch (detectLang(data.toString())) {
  //           case 'Java':
  //             langnum[0]++
  //             break
  //           case 'Python':
  //             langnum[1]++
  //             break
  //           case 'JavaScript':
  //             langnum[2]++
  //             break
  //           case 'PHP':
  //             langnum[3]++
  //             break
  //           case 'Go':
  //             langnum[4]++
  //             break
  //           case 'Ruby':
  //             langnum[5]++
  //             break
  //           case 'CSS':
  //             langnum[6]++
  //             break
  //           case 'HTML':
  //             langnum[7]++
  //             break
  //           case 'C':
  //             langnum[8]++
  //             break
  //           case 'C++':
  //             langnum[8]++
  //           }
  //         })
  //       } else {
  // //         // this.log('folder: ' + name)
  // //         let temp = checkLang(dir + '/' + name)
  // //         temp.forEach((value, index) => {
  // //           langnum[index] += value
  // //         })
  //       }
  //     }))
  //   }
  // })
  return langnum
}

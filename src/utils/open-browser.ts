import cli from 'cli-ux'

const openBrowser = function (url: string) {
  cli.open(url).catch(e => console.log(e))
}

export default openBrowser

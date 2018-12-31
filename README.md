SAKKU cli
=========

this is a sakku cli that makes world even better!

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/sakku-cli.svg)](https://npmjs.org/package/sakku-cli)
[![Downloads/week](https://img.shields.io/npm/dw/sakku-cli.svg)](https://npmjs.org/package/sakku-cli)
[![License](https://img.shields.io/npm/l/sakku-cli.svg)](https://github.com/arvinrokni/sakku_cli_ts/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g sakku-cli
$ sakku COMMAND
running command...
$ sakku (-v|--version|version)
sakku-cli/0.0.0 linux-x64 node-v8.10.0
$ sakku --help [COMMAND]
USAGE
  $ sakku COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`sakku hello [FILE]`](#sakku-hello-file)
* [`sakku help [COMMAND]`](#sakku-help-command)

## `sakku hello [FILE]`

describe the command here

```
USAGE
  $ sakku hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ sakku hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/arvinrokni/sakku_cli_ts/blob/v0.0.0/src/commands/hello.ts)_

## `sakku help [COMMAND]`

display help for sakku

```
USAGE
  $ sakku help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_
<!-- commandsstop -->

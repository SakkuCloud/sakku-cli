SAKKU cli
=========

Sakku cli is trying to make real world even a better place!

[![Version](https://img.shields.io/npm/v/sakku.svg)](https://npmjs.org/package/sakku)
[![Downloads/week](https://img.shields.io/npm/dw/sakku.svg)](https://npmjs.org/package/sakku)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g sakku
$ sakku COMMAND
running command...
$ sakku (-v|--version|version)
sakku/0.0.0 linux-x64 node-v8.10.0
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

Describe the command here

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

<!-- commandsstop -->

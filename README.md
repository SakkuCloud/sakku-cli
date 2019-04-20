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

## `sakku login`

login to Sakku cli interface.

```
USAGE
  $ sakku login

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ sakku login
  ? there is two way you can login: (Use arrow keys)
  ❯ Login by Username/Password
     Login by Browser

```

## `sakku whoami`

login to Sakku cli interface.

```
USAGE
  $ sakku whoami

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ sakku whoami
  |_user info
  |_user state
```

# `sakku app`
manage all apps

```
USAGE
  $ sakku app:COMMAND

COMMANDS
  app:add     add new app
  app:deploy  deploy app
  app:ps      showing all [running/stoped] app
  app:rm      Remove app*
  app:scale   scale app
  app:stop    stop app

```


## `sakku app:add`
add new app

```
USAGE
  $ sakku app:add

OPTIONS
  -h, --help  show CLI help

```

## `sakku app:deploy`
deploy app

```

USAGE
  $ sakku app:deploy

OPTIONS
  -a, --app=app        app name
  -b, --binary=binary  executable binary file
  -i, --image=image    docker-image file
  -s, --source

```

## `sakku app:ps`
showing all [running/all] app

```
USAGE
  $ sakku app:ps

OPTIONS
  -a, --all   show all apps
  -h, --help  show CLI help
```


## `sakku app:rm`
remove app

```
USAGE
  $ sakku app:rm

OPTIONS
  -f, --force
  -h, --help   show CLI help

EXAMPLE
  $ sakku app:rm 
  Enter your app id: APP-ID
  are you really sure to remove? (y/n): y

```

## `sakku app:scale`
scale app

```
USAGE
  $ sakku app:scale

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ sakku app:scale
  Enter your app id: APP-ID
  Enter your app scale: 2
  please wait...... done!
  your app scaled to 2

```


## `sakku app:stop`
stop app

```
USAGE
  $ sakku app:stop

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ sakku app:stop
     Enter your app-id: APP-ID
     please wait...... stoped!
     your app (APP-ID) is stoped

```


## `sakku help`
help!

```
USAGE
  $ sakku help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

<!-- commandsstop -->

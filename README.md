SAKKU cli
=========

Sakku cli is trying to make real world even a better place!

[![Version](https://img.shields.io/npm/v/sakku.svg)](https://npmjs.org/package/sakku)
[![Downloads/week](https://img.shields.io/npm/dw/sakku.svg)](https://npmjs.org/package/sakku)

* [Usage](#usage)
* [Commands](#commands)

# Usage

```bash
$ npm install -g sakku
$ sakku COMMAND
running command...
$ sakku (-v|--version|version)
sakku/0.0.0 linux-x64 node-v8.10.0
$ sakku --help [COMMAND]
USAGE
  $ sakku COMMAND
```


# Commands
* [`sakku help [COMMAND]`](#sakku-help-command)
* [`sakku login`](#sakku-login)
* [`sakku exec APP [CMD]`](#sakku-exec-app-cmd)
* [`sakku whoami`](#sakku-whoami)
* [`sakku catalog`](#sakku-catalog)
* [`sakku app:add`](#sakku-appadd)
* [`sakku app:collab [APP]`](#sakku-appcollab-app)
* [`sakku app:deploy`](#sakku-appdeploy)
* [`sakku app:logs`](#sakku-applogs-app)
* [`sakku app:exportlogs`](#sakku-appexportlogs-app)
* [`sakku app:ps`](#sakku-appps)
* [`sakku app:rm`](#sakku-apprm)
* [`sakku app:scale`](#sakku-appscale-app)
* [`sakku app:stop`](#sakku-appstop)
* [`sakku app:port`](#sakku-appport)
* [`sakku app:stats`](#sakku-appstats)
* [`sakku app:commit`](#sakku-appcommit)
* [`sakku app:restart`](#sakku-apprestart)
* [`sakku app:rebuild`](#sakku-apprebuild)
* [`sakku app:pipeline`](#sakku-apppipeline)
* [`sakku app:healthcheck:all`](#sakku-app-healthcheck-all)
* [`sakku app:healthcheck:create`](#sakku-app-healthcheck-create)
* [`sakku app:healthcheck:rm`](#sakku-app-healthcheck-rm)
* [`sakku domain:all`](#sakku-domain-all)
* [`sakku domain:add`](#sakku-domain-add)
* [`sakku domain:app`](#sakku-domain-app)
* [`sakku domain:rm`](#sakku-domain-rm)
* [`sakku domain:record:all`](#sakku-domain-record-all)
* [`sakku domain:record:add`](#sakku-domain-record-add)
* [`sakku domain:record:update`](#sakku-domain-record-update)
* [`sakku domain:record:rm`](#sakku-domain-record-rm)
* [`sakku network:all`](#sakku-network-all)
* [`sakku network:create`](#sakku-network-create)
* [`sakku network:addapp`](#sakku-network-addapp)
* [`sakku network:rm`](#sakku-network-rm)
* [`sakku network:rmapp`](#sakku-network-rmapp)
* [`sakku image:build`](#sakku-image-build)
* [`sakku image:ps`](#sakku-image-ps)
* [`sakku image:share`](#sakku-image-share)

# `sakku app`
manage all apps

```
USAGE
  $ sakku app:COMMAND

COMMANDS
  app:add       add new app
  app:deploy    deploy app
  app:ps        showing all [running/stopped] app
  app:rm        Remove app*
  app:scale     scale app
  app:stop      stop app
  app:port      change app port
  app:stats     app realtime monitroing
  app:pipeline  create pipeline from docker-compose
  app:logs      app realtime logs
  app:exportlogs    app logs history
  app:commit    commit application container
  app:restart   restart application
  app:rebuild   rebuild application source

```

## `sakku app:add`

add new app


```bash 
USAGE
  $ sakku app:add

OPTIONS
  -h, --help  show CLI help
```

_See code: [src\commands\app\add.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\app\add.ts)_


## `sakku app:collab [APP]`


Add new collaborators, as well as showing the list of collaborators


```
USAGE
  $ sakku app:collab [APP]

ARGUMENTS
  APP  app id/name

OPTIONS
  -a, --add
  -r, --delete
  -e, --edit
  -h, --help    show CLI help

EXAMPLES
  $ sakku app:collab
  $ sakku app:collab -a
```


_See code: [src\commands\app\collab.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\app\collab.ts)_

## `sakku app:deploy`

deploy app


```
USAGE
  $ sakku app:deploy

OPTIONS
  -a, --app=app  app name
```

_See code: [src\commands\app\deploy.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\app\deploy.ts)_

## `sakku app:logs [APP]`

Shows logs of an app


```bash
USAGE
  $ sakku app:logs [APP]

ARGUMENTS
  APP  app id/name

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ sakku app:logs
```

_See code: [src\commands\app\logs.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\app\logs.ts)_

## `sakku app:ps`

showing all [running/all] app


```
USAGE
  $ sakku app:ps

OPTIONS
  -a, --all   show all apps
  -h, --help  show CLI help
```

_See code: [src\commands\app\ps.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\app\ps.ts)_

## `sakku app:rm`

Remove app*

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

_See code: [src\commands\app\rm.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\app\rm.ts)_

## `sakku app:scale [APP]`

scale app

```
USAGE
  $ sakku app:scale [APP]

ARGUMENTS
  APP  app id/name

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ sakku app:scale
  Enter your app id: APP-ID
  Enter your new Configuration
```

_See code: [src\commands\app\scale.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\app\scale.ts)_

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

_See code: [src\commands\app\stop.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\app\stop.ts)_

## `sakku app:stats [APP]`

realtime app monitoring

```
USAGE
  $ sakku app:stats [APP]

OPTIONS
  -h, --help  show CLI help
  -a, --app   app ID

EXAMPLE
  $ sakku app:stats
     Enter your app-id: APP-ID
     Connection established successfully.
     show app stats realtime
```

_See code: [src\commands\app\stats.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.2.1/src\commands\app\stats.ts)_

## `sakku app:pipeline [APP]`

create pipeline from docker-compose

```
USAGE
  $ sakku app:pipeline

OPTIONS
  -h, --help  show CLI help
  -f, --file  docker-compose file path

EXAMPLE
  $ sakku app:pipeline
     Enter your docker compose file: FILE-PATH
     Applications configiguration review ...
     
     Do you want to continue pipeline creation of these applications? (y or n):
     Pipeline applications are being created!
```

_See code: [src\commands\app\pipeline.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.3.0/src\commands\app\pipeline.ts)_

## `sakku app:exportlogs  [APP] [FROM] [TO] [FILE-DIR]`

show / (export to a text file) logs history of an app

```
USAGE
  $ sakku app:exportlogs [APP]

OPTIONS
  -h, --help  show CLI help
  -a, --app   app ID
  -f, --from  from Date
  -t, --to    to Date
  -d, --dir   File Directory

EXAMPLE
  $ sakku app:exportlogs
     Enter app id:: APP-ID
     Enter from date in yyyy/mm/dd | yyyy/mm/dd H:i:s format (Georgian): FROM-DATE
     Enter to date in yyyy/mm/dd | yyyy/mm/dd H:i:s format (Georgian): TO-DATE
     Enter log file directory without file name: (**hint: If you want to save logs in a file, fill this field else skip it!): FILE-DIR
```

_See code: [src\commands\app\exportlogs.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.2.1/src\commands\app\exportlogs.ts)_

## `sakku app:commit [AppID]`

Commit application container

```
USAGE
  $ sakku app:commit 

OPTIONS
  -h, --help  show CLI help
  -a, --app     app ID
  -c, --cid     Container ID
  -t, --tag     TAG
  -r, --isRestart

EXAMPLE
  $ sakku image:commit
        Enter your app id : APP-ID
        Enter container id : CONTAINER-ID
        Change restart image to this image? : (y/n)
        Enter version of application : TAG
```

_See code: [src\commands\app\commit.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.3.0/src\commands\app\commit.ts)_

## `sakku app:restart [AppId]`

Restart application by id

```
USAGE
  $ sakku app:restart 

OPTIONS
  -h, --help  show CLI help
  -a, --app     app ID
  -c, --cstop   {Commit app before stopping}
  -t, --tstop   TAG-STOP {Tag for commited app}
  -s, --cstart  {Start app from specific version}
  -v, --tstart  TAG-START

EXAMPLE
  $ sakku image:restart
      Enter your app id : APP-ID
      Do you want to commit this application before stopping it? : (y/n)
      Enter tag for stopped application : TAG-STOP
      Do you want to start this application from specific version? : (y/n)
      Enter version of application you want to start from : TAG-START
```

_See code: [src\commands\app\restart.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.3.0/src\commands\app\restart.ts)_

## `sakku app:rebuild -a [AppId] -b [buildArgs]`

rebuild application source

```
USAGE
  $ sakku app:rebuild 

OPTIONS
  -h, --help  show CLI help
  -a, --app     app ID
  -b, --build-args   

EXAMPLE
      $ sakku app:rebuild
      Enter your app id : APP-ID
      Enter build Arguments : BUILD-ARGS
```

_See code: [src\commands\app\rebuild.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.3.0/src\commands\app\rebuild.ts)_

## `sakku catalog`

List all different Program Catalogs

```
USAGE
  $ sakku catalog

OPTIONS
  -a, --add   show CLI help
  -h, --help  show CLI help

EXAMPLES
  $ sakku catalog
  $ sakku catalog -a
```

_See code: [src\commands\catalog.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\catalog.ts)_

## `sakku exec APP [CMD]`

execute command on instance

```
USAGE
  $ sakku exec APP [CMD]

ARGUMENTS
  APP  app id/name
  CMD  [default: bash] command

OPTIONS
  -h, --help         show CLI help
  -i, --interactive
  -t, --tty

EXAMPLE
  $ sakku exec
```

_See code: [src\commands\exec.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\exec.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src\commands\help.ts)_

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
  ❯ Login by Username & Password
     Login by Browser
```

_See code: [src\commands\login.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\login.ts)_

## `sakku whoami`

Shows username or complete user info and stats

```
USAGE
  $ sakku whoami

OPTIONS
  -c, --complete
  -h, --help      show CLI help

EXAMPLES
  $ sakku whoami
  $ sakku whoami -c
```

_See code: [src\commands\whoami.ts](https://github.com/makbn/sakku_cli_ts/blob/v0.1.0/src\commands\whoami.ts)_

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

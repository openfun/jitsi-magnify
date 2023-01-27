# Jitsi Magnify

An authentication, room and meeting management system for Jitsi based on Django/React.

Jitsi Magnify is built with [ReactJS](https://fr.reactjs.org/) for the frontend, and
[Django](https://www.djangoproject.com/) for the backend.

## Getting started

### Prerequisite

Make sure you have a recent version of Docker and
[Docker Compose](https://docs.docker.com/compose/install) installed on your laptop:

```bash
$ docker -v
  Docker version 20.10.2, build 2291f61

$ docker-compose -v
  docker-compose version 1.27.4, build 40524192
```

>⚠️ You may need to run the following commands with `sudo` but this can be
>avoided by assigning your user to the `docker` group.

### Project bootstrap

The easiest way to start working on the project is to use our `Makefile` :
```bash
$ make bootstrap
```

This command builds the `app` container, installs dependencies and performs database migrations.
It's a good idea to use this command each time you are pulling code from the project repository
to avoid dependency-releated or migration-releated issues.

When the command stops, check that all services are running as expected:

```bash
$ docker-compose ps
```

You should now be able to access the demo site at [localhost:8070](http://localhost:8070).

Finally, you can see all available commands in our `Makefile` with :

```bash
$ make help
```

### Django admin

You can access the Django admin site at [localhost:8071/admin](http://localhost:8071/admin/).

To access the Django admin, you will first need to create a superuser account:

```bash
$ make superuser
```

## Running Magnify in production

### Configure a Jitsi instance

Before running Magnify, you will need a Jitsi instance with JWT authentication activated:

```
ENABLE_AUTH=1
AUTH_TYPE=jwt
JWT_APP_ID=magnify
JWT_APP_SECRET={JWT_JITSI_APP_SECRET}
```

In the Prosody configuration, you should also set the variable:
`XMPP_DOMAIN={JWT_JITSI_XMPP_DOMAIN}`.

The `JWT_JITSI_APP_SECRET` and `JWT_JITSI_XMPP_DOMAIN` variables should be set to the same value
in your Jitsi instance and in Magnify.

### Configure Magnify

The easiest way to run Magnify in production is to use the [official Docker image][1].

Configuration is done via environment variables as detailed in our
[configuration guide](docs/env.md).

## Contributing

This project is intended to be community-driven, so please, do not hesitate to
get in touch if you have any question related to our implementation or design
decisions.

We try to raise our code quality standards and expect contributors to follow
the recommandations from our
[handbook](https://handbook.openfun.fr).

## License

This work is released under the MIT License (see [LICENSE](./LICENSE)).

[1]: https://hub.docker.com/r/fundocker/jitsi-magnify

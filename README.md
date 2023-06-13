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

$ docker compose version
  Docker Compose version v2.17.3 
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
$ docker compose ps
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


## Frontend

#### Architecture

The front project is split into two parts.

- A first part in `src/frontend/packages/core` contains all the components, services, repositories, and even complete
  pages required to build a magnify application. It also includes an AppRouter component that creates an app and
  its default routes


- Then a sandbox application (`src/frontend/sandbox`) which aims to demonstrate how to use the core package.

#### Configuration variables

A set of configuration variables is required. All variables can be configured directly through the environment
variables of the Django project. They are served to the client via the `/config.json` API route.

Here is the list of all the available variables :

```
{
  "API_URL": "http://localhost:8071/api" // URL of magnify api,
  "JITSI_DOMAIN": "exemple.test",
  "KEYCLOAK_CLIENT_ID": "magnify-front",
  "KEYCLOAK_EXPIRATION_SECONDS": 1800,
  "KEYCLOAK_REALM": "magnify",
  "MAGNIFY_SHOW_REGISTER_LINK": true,
  "KEYCLOAK_URL": "http://localhost:8080"
}

```
You can mock these variables by adding a `config.json` file in the public folder of the sandbox application.

#### Development mode

We have added a compilation option that allows the compiler to directly access the project sources when it encounters
an import from the `@openfun/jitsi-magnify` package.

As a result, to use package components in the sandbox, you don't need to build the package. You just need to export them.

To learn how to export new components, please open the `src/frontend/packages/core/index.ts` file.

You can now navigate to the `src/frontend/sandbox` folder and run the `yarn dev` command directly. Hot reload will
work when you modify a component in the `package/core`.


#### Customization

In order to make magnify customizable, we opted to add the @openfun/cunningham-react package.
[cunningham documentation](https://github.com/openfun/cunningham)

However, cunningham does not contain all the necessary components. So we are still using Grommet for now. We need to do
a mapping between the different cunningham tokens and the Grommet theme configuration.

To see how this mapping works, go to `src/frontend/packages/core/themes/theme.ts` file.


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

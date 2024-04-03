# Magnify

An authentication, room and meeting management system for LiveKit based on Django/React.

Magnify is built with a [ReactJS](https://fr.reactjs.org/) frontend and a 
[Django](https://www.djangoproject.com/) backend.

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

### Configure a LiveKit instance

Before running Magnify, you will need a LiveKit server or cluster runnning.  
If you want to deploy your server to a VM, see [Deploying LiveKit to a VM](https://docs.livekit.io/realtime/self-hosting/vm/).  
If you want to run your server on a Kubernetes cluster, see [Deploying LiveKit to Kubernetes](https://docs.livekit.io/realtime/self-hosting/kubernetes/)

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
  "API_URL": "http://localhost:8071/api",
  "KEYCLOAK_CLIENT_ID": "magnify-front",
  "KEYCLOAK_EXPIRATION_SECONDS": 1800,
  "KEYCLOAK_REALM": "magnify",
  "KEYCLOAK_URL": "http://localhost:8080",
  "LANGUAGE_CODE": "en",
  "MAGNIFY_SHOW_REGISTER_LINK": true,
  "LIVEKIT_DOMAIN": "http://localhost:7880",
  "LIVEKIT_ROOM_SERVICE_BASE_URL" : "http://localhost:7880/twirp/livekit.RoomService/"
}

```
You can mock these variables by adding a `config.json` file in the public folder of the sandbox application.

#### Development mode

We have added a compilation option that allows the compiler to directly access the project sources when it encounters
an import from the `@numerique-gouv/magnify` package.

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

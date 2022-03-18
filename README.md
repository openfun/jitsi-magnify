# Jitsi magnify

An authentication and room management system for Jitsi based on Django.

Jitsi magnify is built on top of [Django Rest Framework](https://www.django-rest-framework.org/), and based on [Joanie](https://github.com/openfun/joanie)

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

This command builds the `app` container, installs dependencies and performs database migrations. It's a good idea to use this command each time you are pulling code from the project repository to avoid dependency-releated or migration-releated issues.

Now that your Docker services are up, let's running them :

```bash
$ make run
```

You should be able to access to the API overview interface at [http://localhost:8071](http://localhost:8071).

Finally, you can see all available commands in our `Makefile` with :

```bash
$ make help
```

If you're preparing for production, it is recommended to host media files in an object storage.
We've cooked [Terraform scripts](https://www.terraform.io/) and a [documentation](docs/media.md)
to make it easy if, like us, you are planning to use [Swift](https://docs.openstack.org/swift). Read more about it: docs/media.md.

If you're planning to use AWS S3 or another object storage service, please let us know by opening
an [issue](https://github.com/openfun/jitsi-magnify/issues) or even better a
[pull request](https://github.com/openfun/jitsi-magnify/pulls) to add it to the project.

### Django admin

You can access the Django admin site at [http://localhost:8071/admin](http://localhost:8071).

You first need to create a superuser account :

```bash
$ make superuser
```

## Guides

### Explanation

Jitsi magnify helps with authenticating users when they access jitsi rooms. Currently, magnify either gets information from logged in user or inputs default values and token payload, and then redirects to jitsi instance with the token.

### Usage in production

The domain of jitsi instance that uses magnify should be referenced in `env.d/development/common`. As for jitsi, env variables should be set to enable jwt auth and to redirect to magnify instance. 

These variables are : 
````
ENABLE_AUTH=1
AUTH_TYPE=jwt
JWT_APP_ID={JWT_JITSI_APP_ID}
TOKEN_AUTH_URL=https://{JWT_JITSI_DOMAIN}/api/token/{room}
````

With JWT_JITSI_APP_ID and JWT_JITSI_DOMAIN equal to the values in `env.d/development/common`.

## Contributing

This project is intended to be community-driven, so please, do not hesitate to
get in touch if you have any question related to our implementation or design
decisions.

We try to raise our code quality standards and expect contributors to follow
the recommandations from our
[handbook](https://openfun.gitbooks.io/handbook/content).

## License

This work is released under the MIT License (see [LICENSE](./LICENSE)).

# Configuration guide

The `Magnify` project tries to follow the [12 factors app](https://12factor.net/) and so relies
only on environment variables for configuration.

This configuration guide applies to the production environment. The development stack is
predefined to work off-the-shelf based on environment variables defined in `env.d` at the root of
the project.

When running [Magnify's official Docker image](https://hub.docker.com/r/fundocker/jitsi-magnify),
our predefined production settings are applied by default.

You may apply other predefined settings by setting the `DJANGO_CONFIGURATION` environment variable:

```bash
$ docker run -e DJANGO_CONFIGURATION=PreProduction ... fundocker/jitsi-magnify:main
```

Other possible values for this envionment variable are: `Build`, `ContinuousIntegration`,
`Development`, `Preprod`, `Staging` and `Test`. You may define your own settings by overriding
the `/app/sandbox/settings.py` file.

Depending on the predefined settings you run, a set of additional environment variables must be
set. In the following, we give a reference guide of all the environment variables you can set
to configure the way Magnify operates in production. The ones that are required are marked with
a 🔴 sign.

### General Django settings

#### 🔴 DJANGO_ALLOWED_HOSTS

A string of comma separated domains that Django should accept and answer to.

See [Django documentation][allowed-hosts] for more details about this setting.

- Type: List as comma separated string
- Required: Yes
- Default: [] (all originating domains are rejected)
- Example: `example1.com,example2.com`

> **Warning**
> The following syntax does not work:
>  `DJANGO_ALLOWED_HOSTS=["example1.com"," example2.com"]`
>
> It would set the ALLOWED_HOST setting in Django to `['["example1.com"," example2.com"]']` which is not what you want.
>
> You should enter the list as a comma separated string:
> `DJANGO_ALLOWED_HOSTS=example1.com,example2.com`

#### 🔴 DJANGO_SECRET_KEY

Standard Django secret key used to make the instance unique and generate hashes such as CSRF
tokens or auth keys.

See [Django documentation][secret-key] for more information about this setting.

- Type: String
- Required: Yes
- Default: None
- Example: `13f1ef@^xqmc=pjv1(!hko7li2a#!f_vuv%cq8$sr2363yn^3!`

#### 🔴 DJANGO_CSRF_TRUSTED_ORIGINS

A list of trusted origins for unsafe requests (e.g. POST). Must at least contain the domain on
which the backend is hosted for the Django admin site to work.

See [Django documentation][csrf-trusted-origins] for more information about this setting.

- Type: List as comma separated strings
- Required: No
- Default: [] (all originating domains are rejected)
- Example: `https://subdomain.example1.com, https://*.example2.com`

#### DJANGO_LANGUAGE_CODE

A string to set the default language code for this installation. This should be in standard
language ID format. For example, U.S. English is "en-us".

At the moment, Magnify does not allow to override Django's `LANGUAGES` setting so the
`LANGUAGE_CODE` setting can only be set to `en` or `fr`.

- Type: String [en|fr]
- Required: No
- Default: `en`
- Example: `fr`

#### DJANGO_CORS_ALLOWED_ORIGINS

You can allow CORS requests (based on [django-cors-headers]) by providing a list of the
allowed origins.

- Type: List as comma separated strings
- Required: No
- Default: []
- Example: `https://example1.com, https://example2.com`

#### DJANGO_SILENCED_SYSTEM_CHECKS

List of automatic checks that should be silenced because they are not appropriate for your
particular deployment configuration.

For more information, see [documentation][security].

- Type: List as comma separated strings
- Required: No
- Default: ["security.W019"]
- Example: `security.W001, security.W002`

#### DJANGO_STATICFILES_STORAGE

The static files storage backend that Django should use to serve static files.

For more information, see [documentation][storages].

- Type: String
- Required: No
- Default: `whitenoise.storage.CompressedManifestStaticFilesStorage`
- Example: `django.contrib.staticfiles.storage.StaticFilesStorage`

#### DJANGO_SENTRY_DSN

Should be set to activate Sentry for an environment. The value of this DSN is given when you
add a project to your Sentry instance.

- Type: String
- Required: No
- Default: None
- Example: `https://az346f1adc3j2s23f56gv74ds3a5fc78@o143317.ingest.sentry.io/2435467`

#### DRF_DEFAULT_AUTHENTICATION_CLASSES

The REST framework will attempt to authenticate with each class in this list of default
authentication schemes.

For more information, see [documentation][drf-authentication].

- Type: List as comma separated strings
- Required: No
- Default: ["rest_framework_simplejwt.authentication.JWTAuthentication"]
- Example:
    `rest_framework_simplejwt.authentication.JWTAuthentication, rest_framework.authentication.SessionAuthentication`

### Magnify specific settings

#### 🔴 MAGNIFY_API_URL

The base url of the API that the frontend should contact. It allows to point to a specific version
of the API.

- Type: String
- Required: Yes
- Example: `https://example.com/api`

#### MAGNIFY_JWT_ALGORITHM

The algorithm used for decoding OIDC JWT tokens. PyJWT supports different digital signature
algorithms (like RSA or ECDSA), the cryptography library being installed in Magnify.

For more information, see [DRF Simple JWT documentation][algorithm]

- Type: String
- Required: No
- Default: `RS256`
- Example: `RS512`, `HS256`, etc.

#### 🔴 MAGNIFY_JWT_JWK_URL

Dynamically resolve the public keys needed to verify the signing of OIDC tokens.

For more information, see [DRF Simple JWT documentation][jwk-url]

- Type: String
- Required: Either this setting or `MAGNIFY_JWT_VERIFYING_KEY` should be set.
- Default: None
- Example: `http://keycloak.com/realms/magnify/protocol/openid-connect/certs`

#### 🔴 MAGNIFY_JWT_VERIFYING_KEY

The public key used to verify OIDC tokens.

For more information, see [DRF Simple JWT documentation][verifying-key]

- Type: String
- Required: No
- Example: Dummy RS256 public key
    ```
    -----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy8Dbv8prpJ/0kKhlGeJY
    ozo2t60EG8L0561g13R29LvMR5hyvGZlGJpmn65+A4xHXInJYiPuKzrKUnApeLZ+
    vw1HocOAZtWK0z3r26uA8kQYOKX9Qt/DbCdvsF9wF8gRK0ptx9M6R13NvBxvVQAp
    fc9jB9nTzphOgM4JiEYvlV8FLhg9yZovMYd6Wwf3aoXK891VQxTr/kQYoq1Yp+68
    i6T4nNq7NWC+UNVjQHxNQMQMzU6lWCX8zyg3yH88OAQkUXIXKfQ+NkvYQ1cxaMoV
    PpY72+eVthKzpMeyHkBn7ciumk5qgLTEJAfWZpe4f4eFZj/Rc8Y8Jj2IS5kVPjUy
    wQIDAQAB
    -----END PUBLIC KEY-----
    ```

#### MAGNIFY_JWT_USER_FIELDS_SYNC

Mapping between fields of the Magnify's User model and fields in the OIDC token used to
authenticate requests.

- Type: String
- Required: No, but if you keep the default value, Authentication will work correctly only if
  your JWT tokens contain a `name` and a `preferred_username` fields.
- Default:
    ```
    {
        "email": "email",
        "name": "name",
        "username": "preferred_username",
    }
    ```
- Example: `{"email": "email", "name": "name", "username": "preferred_username"}`

#### MAGNIFY_LIVEKIT_ROOM_PREFIX

A prefix that will be added in front of the room UUID to compose the LiveKit room name used
for the conference.

- Type: string
- Required: No
- Default: ""
- Example: `123`

#### MAGNIFY_DEFAULT_ROOM_IS_PUBLIC

Whether rooms are created as public by default. Rooms that are not marked as public, will not
deliver any LiveKit token to users who are not authenticated or to users who have not been
assigned any role in the room.

- Type: Boolean as string
  * True: 'yes', 'y', 'true', '1'
  * False: 'no', 'n', 'false', '0', '' (empty string)
- Required: No
- Default: True
- Example: `false`

#### MAGNIFY_ALLOW_UNREGISTERED_ROOMS

Whether users can join a room that is not reserved in Magnify. When activated, Magnify will
generate a LiveKit token to any user visiting any room that is not registered.

- Type: Boolean as string
  * True: 'yes', 'y', 'true', '1'
  * False: 'no', 'n', 'false', '0', '' (empty string)
- Required: No
- Default: True
- Example: `false`

#### MAGNIFY_ALLOW_API_USER_CREATE

Whether users can be created via the API. When not allowed, user handling is delegated to
an external tool and Magnify creates users on-the-fly based on OIDC tokens received.

- Type: Boolean as string
  * True: 'yes', 'y', 'true', '1'
  * False: 'no', 'n', 'false', '0', '' (empty string)
- Required: No
- Default: False
- Example: `true`

#### MAGNIFY_USERNAME_REGEX

Defines what characters are accepted on the `username` field of the user model.
When customizing it, don't forget to update your translations to customize the
message held by the placeholder string `username_validator_message`.

Make sure your identity provider (Keycloak in the case of our development sandbox)
is not more permissive on username characters otherwise a user can be created in the
identity provider with a username that will then be rejected by Django.

- Type: String
- Required: No
- Default: `^[a-z0-9_.-]+$`
- Example: `^[a-zA-Z0-9_.-]+$` (accept also upper case letters)

#### MAGNIFY_JWT_USER_DEVICE_AUDIENCES

A list of "audiences" (`aud` attribute in the OIDC token) that will be flagged as being reserved
to device users. This allows us to differentiate these users in the interface and customize
their experience and access rights.

- Type: List as string
- Required: No
- Default: []
- Example: `magnify-box,sip-gateway`


### Livekit-related settings

The following settings define the Livekit instance.

As a reminder, LiveKit token are generated by the backend with the livekit python library, given the api key and api secret of the LiveKit server.

#### 🔴 LIVEKIT_DOMAIN

Domain on which the LiveKit server that is used by Magnify to host conferences is hosted.

- Type: String
- Required: Yes
- Default: `meeting.education`
- Example: `mycloud.livekit.io`

#### 🔴 LIVEKIT_API_KEY

Secret key of the LiveKit server to which Magnify should connect. Ask this from the people
operating the LiveKit instance.

- Type: String
- Required: Yes
- Example: `lyb3}eDqJB:^~I[kdzG3Db>@_<)pus[KsbT<Q&0R.v_OLq&Y44W`

#### LIVEKIT_TOKEN_EXPIRATION_SECONDS

Expiration delay in seconds of the LiveKit tokens issued by Magnify to connect to the LiveKit instance. Note that once a LiveKit token is generated, the backend will not allow one to regenerate one without leaving and rejoining the room. We advice you to set this TTL so that tokens are valid for the entire time of the longest conference you want to be able to have.

- Type: Integer as a string
- Required: No
- Default: 300
- Example: `1800`

#### LIVEKIT_ROOM_SERVICE_BASE_URL

Participants of a room use the [RoomService API feature](https://docs.livekit.io/reference/server/server-apis) in order to interact with each other. This variable will set the url of the API endpoint.

- Type: Integer as a string
- Required: yes
- Example: `http://localhost:7880/twirp/livekit.RoomService/`

### Database-related settings

#### DB_ENGINE

Full path to the Python class of the backend used by Magnify to connect to the database.

- Type: String
- Required: No
- Default: `django.db.backends.postgresql_psycopg2` (Postgresql)

#### DB_HOST

Address for the database used by Magnify.

- Type: String
- Required: No
- Default: `postgresql`

#### DB_NAME

Name of the database used by Magnify.

- Type: String
- Required: No
- Default: `magnify`

#### DB_USER

Name of the user to connect to the database used by Magnify.

- Type: String
- Required: No
- Default: `magnify`

#### 🔴 DB_PASSWORD

Password corresponding to the user specified in `DB_USER` and used by Magnify to
connect to the database.

- Type: String
- Required: Yes
- Example: `13f1ef@^xqmc=pjv1(!hko7li2a#!f_vuv%cq8$sr2363yn^3!`

#### DB_PORT

Port used by Magnify to connect to the database.

- Type: Integer as a string
- Required: No
- Default: `5432`

### Keycloak-related settings

#### 🔴 KEYCLOAK_URL

Keycloak URL to which Magnify should send users to authenticate.

- Type: String
- Required: Yes
- Example: `http://keycloak.com`

#### KEYCLOAK_REALM

Keycloak realm to which Magnify should send users to authenticate.

- Type: String
- Required: No, but with the default value, your Keycloak instance will need to present a realm
  called `magnify`
- Default: `magnify`
- Example: `my-magnify`

#### KEYCLOAK_CLIENT_ID

Keycloak client with which users should be authenticated in order to consume Magnify.

- Type: String
- Required: No, but with the default value, your Keycloak instance will need to present a client
  called `magnify-frontend`
- Default: `magnify-frontend`
- Example: `my-magnify-frontend`

#### KEYCLOAK_EXPIRATION_SECONDS

Expiration delay in seconds of the OIDC tokens issued by Keycloak to allow users to interact with
Magnify. The frontend will refresh tokens automatically with Keycloak when they expire.

- Type: Integer as a string
- Required: No
- Default: 1800
- Example: `3600`

### Crowdin API access related settings

These settings are only used for build purposes in order to push/pull translations
to/from Crowdin.

#### CROWDIN_API_KEY

The API access key provided by Crowdin. Only managers can have access to this key.

- Type: String
- Required: No
- Default: None

#### CROWDIN_PROJECT_ID

The unique project identifier provided by Crowdin. Only managers can have access to this setting.

- Type: String
- Required: No
- Default: None

#### CROWDIN_BASE_PATH

The path from where the `crowdin-cli` will work, this path should point to the `src` directory of magnify.

By default its value is `/app/src` and while you are using the container configured in our `docker-compose` file you have no need to change it.

- Type: String
- Required: No
- Default: `/app/src`

[algorithm]: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html#algorithm
[allowed-hosts]: https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
[csrf-trusted-origins]: https://docs.djangoproject.com/en/dev/ref/settings/#csrf-trusted-origins
[django-cors-headers]: https://github.com/adamchainz/django-cors-headers
[drf-authentication]: https://www.django-rest-framework.org/api-guide/authentication/
[jwk-url]: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html#jwk-url
[secret-key]: https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
[security]: https://docs.djangoproject.com/en/dev/ref/checks/#security
[storages]: https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#storages

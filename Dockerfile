# Magnify, a room management system for Jitsi
#
# Nota bene:
#
# this container expects two volumes for statics and media files (that will be
# served by nginx):
#
# * /data/media
# * /data/static
#
# Once mounted, you will need to collect static files via the eponym django
# admin command:
#
#     python sandbox/manage.py collectstatic
#

# ---- Base image to inherit from ----
FROM python:3.10-buster as base

# ---- Front-end builder image ----
FROM node:latest as front-builder

# Copy frontend app sources
COPY ./src/frontend /builder/src/frontend

WORKDIR /builder/src/frontend

RUN yarn install --frozen-lockfile && \
    yarn build

# ---- Back-end builder image ----
FROM base as back-builder

WORKDIR /builder

# Copy required python dependencies
COPY setup.py setup.cfg MANIFEST.in /builder/
COPY ./src/magnify /builder/src/magnify/

# Copy distributed application's statics
COPY --from=front-builder \
    /builder/src/frontend/sandbox/dist \
    /builder/src/magnify/static/frontend

# Upgrade pip to its latest release to speed up dependencies installation
RUN pip install --upgrade pip

RUN mkdir /install && \
    pip install --prefix=/install .[sandbox]

# ---- static link collector ----
FROM base as link-collector
ARG MAGNIFY_STATIC_ROOT=/data/static

# Install libpangocairo & rdfind
RUN apt-get update && \
    apt-get install -y \
      libpangocairo-1.0-0 \
      rdfind && \
    rm -rf /var/lib/apt/lists/*

# Copy installed python dependencies
COPY --from=back-builder /install /usr/local

# Copy runtime-required files
COPY ./sandbox /app/sandbox

WORKDIR /app/sandbox

# collectstatic
RUN DJANGO_CONFIGURATION=Build python manage.py collectstatic --noinput

# Replace duplicated file by a symlink to decrease the overall size of the
# final image
RUN rdfind -makesymlinks true -followsymlinks true -makeresultsfile false ${MAGNIFY_STATIC_ROOT}

# ---- Core application image ----
FROM base as core

# Install gettext
RUN apt-get update && \
    apt-get install -y \
    gettext && \
    rm -rf /var/lib/apt/lists/*

# Copy installed python dependencies
COPY --from=back-builder /install /usr/local

# Copy runtime-required files
COPY ./sandbox /app/sandbox
COPY ./docker/files/usr/local/bin/entrypoint /usr/local/bin/entrypoint

# Gunicorn
RUN mkdir -p /usr/local/etc/gunicorn
COPY docker/files/usr/local/etc/gunicorn/magnify.py /usr/local/etc/gunicorn/magnify.py

# Give the "root" group the same permissions as the "root" user on /etc/passwd
# to allow a user belonging to the root group to add new users; typically the
# docker user (see entrypoint).
RUN chmod g=u /etc/passwd

# Un-privileged user running the application
ARG DOCKER_USER
USER ${DOCKER_USER}

# We wrap commands run in this container by the following entrypoint that
# creates a user on-the-fly with the container user ID (see USER) and root group
# ID.
ENTRYPOINT [ "/usr/local/bin/entrypoint" ]

# ---- Development image ----
FROM core as development

ENV DJANGO_SETTINGS_MODULE="settings"

# Switch back to the root user to install development dependencies
USER root:root

WORKDIR /app

# Upgrade pip to its latest release to speed up dependencies installation
RUN pip install --upgrade pip

# Copy all sources, not only runtime-required files
COPY . /app/

# Uninstall magnify and re-install it in editable mode along with development
# dependencies
RUN pip uninstall -y magnify
RUN pip install -e .[dev]

# Restore the un-privileged user running the application
ARG DOCKER_USER
USER ${DOCKER_USER}

# Target database host (e.g. database engine following docker-compose services
# name) & port
ENV DB_HOST=postgresql \
    DB_PORT=5432

# Run django development server
CMD python sandbox/manage.py runserver 0.0.0.0:8000

# ---- Production image ----
FROM core as production

ENV DJANGO_SETTINGS_MODULE="settings"
ENV DJANGO_CONFIGURATION="Production"

ARG MAGNIFY_STATIC_ROOT=/data/static

WORKDIR /app/sandbox

# Copy statics
COPY --from=link-collector ${MAGNIFY_STATIC_ROOT} ${MAGNIFY_STATIC_ROOT}

# The default command runs gunicorn WSGI server in the sandbox
CMD gunicorn -c /usr/local/etc/gunicorn/magnify.py wsgi:application

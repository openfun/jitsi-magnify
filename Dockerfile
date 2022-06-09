# Jitsi Magnify

# ---- Base image to inherit from ----
FROM python:3.8-slim-bullseye as base

# ---- Front-end builder image ----
FROM node:14 as front-builder

# ---- Back-end builder image ----
FROM base as back-builder

WORKDIR /builder

# Copy required python dependencies
COPY setup.py setup.cfg MANIFEST.in /builder/
COPY ./src/magnify /builder/src/magnify/

# Upgrade pip to its latest release to speed up dependencies installation
RUN pip install --upgrade pip

RUN mkdir /install && \
    pip install --prefix=/install .[sandbox]

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
COPY ./src/demo/backend /app/demo/backend
COPY ./docker/files/usr/local/bin/entrypoint /usr/local/bin/entrypoint
RUN ls -la /app
RUN ls -la /app/demo
RUN ls -la /app/demo/backend

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

# Switch back to the root user to install development dependencies
USER root:root

WORKDIR /app

# Upgrade pip to its latest release to speed up dependencies installation
RUN pip install --upgrade pip

# Copy all sources, not only runtime-required files
RUN ls -la /app/
COPY . /app/
RUN ls -la /app/

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
CMD cd /app/demo/backend && python manage.py runserver 0.0.0.0:8000

# ---- Production image ----
FROM core as production

WORKDIR /app/demo/backend

# The default command runs gunicorn WSGI server in the sandbox
CMD gunicorn -c /usr/local/etc/gunicorn/magnify.py wsgi:application

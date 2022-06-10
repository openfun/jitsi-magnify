# Jitsi Magnify


# ====================================
# ==== Base image to inherit from ====
# ====================================
FROM python:3.8-slim-bullseye as base

# Upgrade pip to its latest release to speed up dependencies installation
RUN python -m pip install --upgrade pip

# Upgrade system packages to install security updates
RUN apt-get update && \
    apt-get -y upgrade && \
    rm -rf /var/lib/apt/lists/*


# ============================
# ==== Backend core image ====
# ============================
FROM base as core

WORKDIR /app

USER root

# Copy entrypoint to the image
COPY docker/files/usr/local/bin/entrypoint /usr/local/bin/entrypoint

# Copy the demo project
COPY ./src/demo/backend /app

# Create a folder for the libraries
RUN mkdir /usr/local/jitsi-magnify

# Copy the lib
COPY ./src/magnify /usr/local/jitsi-magnify/magnify

# We wrap commands run in this container by the following entrypoint that
# creates a user on-the-fly with the container user ID (see USER) and root group
# ID.
ENTRYPOINT [ "/usr/local/bin/entrypoint" ]


# ====================================
# ==== Back-end development image ====
# ====================================
FROM core as development

WORKDIR /app

# Install dev dependencies for the magnify using setup.cfg
RUN cd /usr/local/jitsi-magnify/magnify && pip install -e .[dev]

# Give the "root" group the same permissions as the "root" user on /etc/passwd
# to allow a user belonging to the root group to add new users; typically the
# docker user (see entrypoint).
RUN chmod g=u /etc/passwd

# Restore the un-privileged user running the application
ARG DOCKER_USER
USER ${DOCKER_USER}

# Target database host (e.g. database engine following docker-compose services
# name) & port
ENV DB_HOST=postgresql \
  DB_PORT=5432

# Copy the lib and the demo and install everything
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]


# ===================================
# ==== Back-end production image ====
# ===================================
FROM core as production
WORKDIR /app

# Install magnify in normal mode
RUN pip install /usr/local/jitsi-magnify/magnify

# Delete the lib folder
RUN rm -r /usr/local/jitsi-magnify

# Gunicorn
RUN mkdir /usr/local/etc/gunicorn
COPY docker/files/usr/local/etc/gunicorn/magnify.py /usr/local/etc/gunicorn/magnify.py

# Un-privileged user running the application
ARG DOCKER_USER
USER ${DOCKER_USER}

# default command runs gunicorn WSGI server in magnify's main module
CMD gunicorn -c /usr/local/etc/gunicorn/magnify.py wsgi

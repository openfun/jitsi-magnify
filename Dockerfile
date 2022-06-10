# Jitsi Magnify

# ---- Base image to inherit from ----
FROM python:3.8-slim-bullseye as base

# ---- Back-end builder image ----
FROM base as development

WORKDIR /app

USER root

COPY docker/files/usr/local/bin/entrypoint /usr/local/bin/entrypoint

# Upgrade pip to its latest release to speed up dependencies installation
RUN pip install --upgrade pip

# Copy the demo project
COPY ./src/demo/backend /app

# Copy the libraries and the tests
RUN mkdir /usr/local/jitsi-magnify
COPY ./src/magnify /usr/local/jitsi-magnify/magnify

# Install dev dependencies for this package using setup.cfg
RUN cd /usr/local/jitsi-magnify/magnify && pip install -e .[dev]

# We wrap commands run in this container by the following entrypoint that
# creates a user on-the-fly with the container user ID (see USER) and root group
# ID.
ENTRYPOINT [ "/usr/local/bin/entrypoint" ]

# Copy the lib and the demo and install everything
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]

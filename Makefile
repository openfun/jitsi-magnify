# Magnify's Makefile
#
# /!\ /!\ /!\ /!\ /!\ /!\ /!\ DISCLAIMER /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
#
# This Makefile is only meant to be used for DEVELOPMENT purpose as we are
# changing the user id that will run in the container.
#
# PLEASE DO NOT USE IT FOR YOUR CI/PRODUCTION/WHATEVER...
#
# /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
#
# Note to developpers:
#
# While editing this file, please respect the following statements:
#
# 1. Every variable should be defined in the ad hoc VARIABLES section with a
#    relevant subsection
# 2. Every new rule should be defined in the ad hoc RULES section with a
#    relevant subsection depending on the targeted service
# 3. Rules should be sorted alphabetically within their section
# 4. When a rule has multiple dependencies, you should:
#    - duplicate the rule name to add the help string (if required)
#    - write one dependency per line to increase readability and diffs
# 5. .PHONY rule statement should be written after the corresponding rule

# ==============================================================================
# VARIABLES

# -- Database
# Database engine switch: if the DB_HOST=mysql environment variable is defined,
# we'll use the mysql docker-compose service as a database backend instead of
# postgresql (default).
ifeq ($(DB_HOST), mysql)
  DB_PORT            = 3306
else
  DB_HOST            = postgresql
  DB_PORT            = 5432
endif

# -- Docker
# Get the current user ID to use for docker run and docker exec commands
DOCKER_UID           = $(shell id -u)
DOCKER_GID           = $(shell id -g)
DOCKER_USER          = $(DOCKER_UID):$(DOCKER_GID)
COMPOSE              = DOCKER_USER=$(DOCKER_USER) DB_HOST=$(DB_HOST) DB_PORT=$(DB_PORT) docker-compose
COMPOSE_RUN          = $(COMPOSE) run --rm
COMPOSE_EXEC         = $(COMPOSE) exec
COMPOSE_EXEC_APP     = $(COMPOSE_EXEC) app
COMPOSE_EXEC_NODE    = $(COMPOSE_EXEC) node
COMPOSE_RUN_APP      = $(COMPOSE_RUN) app
COMPOSE_RUN_CROWDIN  = $(COMPOSE_RUN) crowdin crowdin
COMPOSE_TEST_RUN     = $(COMPOSE) run --rm -e DJANGO_CONFIGURATION=Test
COMPOSE_TEST_RUN_APP = $(COMPOSE_TEST_RUN) app

PYTHON_FILES         = src/magnify/apps sandbox

# -- Django
MANAGE               = $(COMPOSE_RUN_APP) python sandbox/manage.py
WAIT_DB              = $(COMPOSE_RUN) dockerize -wait tcp://$(DB_HOST):$(DB_PORT) -timeout 60s
WAIT_APP             = $(COMPOSE_RUN) dockerize -wait tcp://app:8000 -timeout 60s

# ==============================================================================
# RULES

default: help

# -- Project
bootstrap: ## install development dependencies
bootstrap: \
  env.d/development/crowdin \
  data/media/.keep \
  data/smedia/.keep \
  data/static/.keep \
  build-front \
  build \
  run \
  migrate \
  superuser
.PHONY: bootstrap

# -- Docker/compose
build: ## build the app container
	@$(COMPOSE) build app
.PHONY: build

down: ## remove stack (warning: it removes the database container)
	@$(COMPOSE) down
.PHONY: down

logs: ## display app logs (follow mode)
	@$(COMPOSE) logs -f app
.PHONY: logs

run: ## start the development server
	@$(COMPOSE) up -d nginx
	@echo "Wait for services to be up..."
	@$(WAIT_DB)
	@$(WAIT_APP)
.PHONY: run

status: ## an alias for "docker-compose ps"
	@$(COMPOSE) ps
.PHONY: status

stop: ## stop the development server
	@$(COMPOSE) stop
.PHONY: stop

# -- Front-end
install-front: ## Install frontend
	@$(COMPOSE_RUN) -e HOME="/tmp" node yarn install

build-front-%: ## Build frontend for a specific package
	@$(COMPOSE_RUN) -e HOME="/tmp" -w /app/src/frontend/$* node yarn build

build-front: ## Build frontend for each package
build-front:
	@$(MAKE) install-front
	@$(MAKE) build-front-magnify
	@$(MAKE) build-front-demo

test-front-%: ## Test frontend for a specific package
	@$(COMPOSE_RUN) -e HOME="/tmp" -w /app/src/frontend/$* node yarn test

test-front: ## Test frontend for each package
test-front:
	@$(MAKE) test-front-magnify
	@$(MAKE) test-front-demo

lint-front: ## run all front-end "linters"
lint-front: \
  lint-front-eslint \
  lint-front-prettier
.PHONY: lint-front

lint-front-prettier: ## run prettier over js/jsx/json/ts/tsx files -- beware! overwrites files
	@$(COMPOSE_RUN) -e HOME="/tmp" node yarn prettier-write
.PHONY: lint-front-prettier

lint-front-eslint: ## lint TypeScript sources
	@$(COMPOSE_RUN) -e HOME="/tmp" node yarn lint
.PHONY: lint-front-eslint

# -- Back-end
compilemessages: ## compile the gettext files
	@$(COMPOSE_RUN) -w /app/src/magnify app python /app/sandbox/manage.py compilemessages
.PHONY: compilemessages

# Nota bene: Black should come after isort just in case they don't agree...
lint-back: ## lint back-end python sources
lint-back: \
  lint-back-isort \
  lint-back-black \
  lint-back-flake8 \
  lint-back-pylint \
  lint-back-bandit
.PHONY: lint-back

lint-back-diff: ## lint back-end python sources, but only what has changed since master
	@bin/lint-back-diff
.PHONY: lint-back-diff

lint-back-black: ## lint back-end python sources with black
	@echo 'lint:black started…'
	@$(COMPOSE_TEST_RUN_APP) black . 
.PHONY: lint-back-black

lint-back-flake8: ## lint back-end python sources with flake8
	@echo 'lint:flake8 started…'
	@$(COMPOSE_TEST_RUN_APP) flake8 ${PYTHON_FILES} tests
.PHONY: lint-back-flake8

lint-back-isort: ## automatically re-arrange python imports in back-end code base
	@echo 'lint:isort started…'
	@$(COMPOSE_TEST_RUN_APP) isort --atomic ${PYTHON_FILES} tests
.PHONY: lint-back-isort

lint-back-pylint: ## lint back-end python sources with pylint
	@echo 'lint:pylint started…'
	@$(COMPOSE_TEST_RUN_APP) pylint ${PYTHON_FILES} tests
.PHONY: lint-back-pylint

lint-back-bandit: ## lint back-end python sources with bandit
	@echo 'lint:bandit started…'
	@$(COMPOSE_TEST_RUN_APP) bandit -qr ${PYTHON_FILES}
.PHONY: lint-back-bandit

messages: ## create the .po files used for i18n
	@$(COMPOSE_RUN) -w /app/src/magnify app python /app/sandbox/manage.py makemessages --keep-pot
.PHONY: messages

migrate: ## perform database migrations
	@$(COMPOSE) up -d ${DB_HOST}
	@$(WAIT_DB)
	@$(MANAGE) migrate
.PHONY: migrate

superuser: ## Create an admin user with password "admin"
	@$(COMPOSE) up -d mysql
	@echo "Wait for services to be up..."
	@$(WAIT_DB)
	@$(MANAGE) shell -c "from magnify.apps.core.models import User; not User.objects.filter(username='admin').exists() and User.objects.create_superuser('admin', 'admin@example.com', 'admin')"
.PHONY: superuser

test-back: ## run back-end tests
	@DB_PORT=$(DB_PORT) bin/pytest
.PHONY: test-back

# -- Internationalization
crowdin-download: ## download translated message from Crowdin
	@$(COMPOSE_RUN_CROWDIN) download -c crowdin/config.yml
.PHONY: crowdin-download

crowdin-upload: ## upload source translations to Crowdin
	@$(COMPOSE_RUN_CROWDIN) upload sources -c crowdin/config.yml
.PHONY: crowdin-upload

i18n-compile: ## compile translated messages to be used by all applications
i18n-compile: \
  i18n-compile-back \
  i18n-compile-front
.PHONY: i18n-compile

i18n-compile-back:
	@$(COMPOSE_RUN) -w /app/src/magnify app python /app/sandbox/manage.py compilemessages
.PHONY: i18n-compile-back

i18n-compile-front-%: ## Compile translated messages for a specific frontend package
	@$(COMPOSE_RUN) -e HOME="/tmp" -w /app/src/frontend/$* node yarn compile-translations

i18n-compile-front: ## Compile translated messages for all frontend packages
	@$(MAKE) i18n-compile-front-magnify
.PHONY: i18n-compile-front

i18n-download-and-compile: ## download all translated messages and compile them to be used by all applications
i18n-download-and-compile: \
  crowdin-download \
  i18n-compile
.PHONY: i18n-download-and-compile

i18n-generate: ## generate source translations files for all applications
i18n-generate: \
  i18n-generate-back \
  i18n-generate-front ## generate source translations files for all applications
.PHONY: i18n-generate

i18n-generate-and-upload: ## generate source translations for all applications and upload then to crowdin
i18n-generate-and-upload: \
  i18n-generate \
  crowdin-upload
.PHONY: i18n-generate-and-upload

i18n-generate-back:
	@$(COMPOSE_RUN) -w /app/src/magnify app python /app/sandbox/manage.py makemessages --ignore "venv/**/*" --keep-pot --all
.PHONY: i18n-generate-back

i18n-generate-front-%: ## Extract strings to be translated from the code of a specific frontend package
	@$(COMPOSE_RUN) -e HOME="/tmp" -w /app/src/frontend/$* node yarn extract-translations

i18n-generate-front: ## Extract strings to be translated from the code of all frontend packages
	@$(MAKE) i18n-generate-front-magnify
.PHONY: i18n-generate-front

# -- Misc
clean: ## restore repository state as it was freshly cloned
	git clean -idx
.PHONY: clean

env.d/development/crowdin:
	cp env.d/development/crowdin.dist env.d/development/crowdin

data/media/.keep:
	@echo 'Preparing media volume...'
	@mkdir -p data/media/
	@touch data/media/.keep

data/smedia/.keep:
	@echo 'Preparing secure media volume...'
	@mkdir -p data/smedia/
	@touch data/smedia/.keep

data/static/.keep:
	@echo 'Preparing static volume...'
	@mkdir -p data/static
	@touch data/static/.keep

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.PHONY: help

.PHONY: build build-alpine clean test help default

BIN_NAME=vahana
DOCKER_COMPOSE=containers/docker-compose.yml

help:
	@echo 'Commands'
	@echo
	@echo 'Usage:'
	@echo '    setup-and-run        Set up dependencies and run project.'
	@echo '    make start-infra     Set up infrastructure dependencies.'
	@echo '    make build           Compile the project.'
	@echo '    make start           Start ther server.'
	@echo '    make migrate         Run the migrations (if any).'
	@echo '    make stop-infra      Shut down infrastructure dependencies.'
	@echo
	@echo 'Requirements: (Tested on)'
	@echo '    Go version 1.12.5'
	@echo '    docker-compose 1.24.1'
	@echo

setup-and-run: stop-infra start-infra build delay migrate start

start-infra:
	@echo "Setting up Infra requirements for ${BIN_NAME}"
	docker-compose -f ${DOCKER_COMPOSE} up -d --build

delay:
	@echo "Waiting for DB to load"
	@sleep 3

build:
	@echo "building ${BIN_NAME}"
	go generate && go build -o bin/${BIN_NAME}

start: 
	@echo "starting ${BIN_NAME}"
	./bin/${BIN_NAME} server

migrate:
	@echo "Running migrations ${BIN_NAME}"
	./bin/${BIN_NAME} migrate

stop-infra:
	@echo "Setting up Infra requirements for ${BIN_NAME}"
	docker-compose -f ${DOCKER_COMPOSE} stop

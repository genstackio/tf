export CI

build: ## Build
	@yarn --silent build

clean: clean-modules clean-lib clean-coverage
clean-coverage: ## Remove test coverage directory
	@rm -rf coverage/
clean-lib: ## Remove lib directory
	@rm -rf lib/
	@rm -f tsconfig.tsbuildinfo
clean-modules: ## Remove Javascript dependencies directory
	@rm -rf node_modules/

format:
	@yarn --silent run format
format-check:
	@yarn --silent run format:check

generate:
	@yarn --silent genjs

install: ## Install the Javascript dependencies
	@yarn --silent install

lint:
	@yarn --silent run lint

pr:
	@hub pull-request -b main

publish: install clean-lib test build publish-only
publish-only:
	@npx semantic-release

test: ## Execute the tests
	@CI=true yarn --silent test --all --color --coverage --detectOpenHandles
test-ci: ## Execute the tests
	@CI=true yarn --silent test --all --color --coverage --detectOpenHandles
test-cov: ## Execute the tests
	@yarn --silent test --coverage --detectOpenHandles
test-dev: ## Execute the tests
	@yarn --silent test --all --color --detectOpenHandles

.DEFAULT_GOAL := install
.PHONY: build \
		clean clean-coverage clean-modules \
		format format-check \
		generate \
		install \
		lint \
		publish publish-only \
		test test-ci test-cov test-dev

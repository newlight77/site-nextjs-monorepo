
install:
	@pnpm install

build:
	@turbo run build

build-site:
	@turbo run build --filter={apps/site-nextjs}

format:
	@yarn format

lint:
	@turbo run lint

start:
	@turbo run start

start-site:
	@turbo run start --filter={apps/site-nextjs}

clean:
	@turbo run clean
	@find . -name 'node_modules' -exec rm -fr {} \;


test:
	@turbo run test

test-site-nextjs:
	@turbo run test --filter site-nextjs

test-react-library:
	@turbo run test --filter react-library

test-notion-library:
	@turbo run test --filter react-notion-library

test-notion-service:
	@turbo run test --filter blog-content-service

test-cententful-adapter:
	@turbo run test --filter blog-content-cententful-adapter

test-notion-adapter:
	@turbo run test --filter blog-content-notion-adapter




add-deps-notion:
	@pnpm add --save-dev \
		@notionhq/client \
		--filter blog-content-notion-adapter


add-deps-test-presets:
	@pnpm add --save-dev \
		babel-jest \
		identity-obj-proxy \
		ts-jest \
		@graphql-tools/jest-transform \
		--filter jest-presets \

add-deps-test:
	@pnpm add --save-dev \
		jest \
		@types/jest \
		@types/node \
		--filter logger \
		--filter blog-content-service \
		--filter blog-content-contentful-adapter \
		--filter blog-content-notipn-adapter \
		--filter react-library \
		--filter react-notion-library \
		--filter site-nextjs

add-deps-test-react:
	@pnpm add --save-dev \
		@testing-library/react \
		@testing-library/jest-dom \
		@testing-library/user-event \
		@types/react-test-renderer \
		@types/testing-library__jest-dom \
		jest-environment-jsdom \
		react-app-polyfill \
		react-test-renderer \
		--filter react-library \
		--filter react-notion-library
 
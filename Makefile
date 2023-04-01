
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




add-notion-deps-spi-notion:
	@pnpm add --save-dev \
		@notionhq/client \
		--filter blog-content-notion-adapter


add-test-deps:
	@pnpm add --save-dev \
		jest \
		ts-jest \
		@types/jest \
		@types/node \
		--filter logger \
		--filter blog-content-service \
		--filter blog-content-contentful-adapter \
		--filter blog-content-notipn-adapter \
		--filter react-library \
		--filter react-notion-library \
		--filter site-nextjs

add-test-deps-notion-library:
	@pnpm add --save-dev \
		@testing-library/react \
		@testing-library/jest-dom \
		@testing-library/user-event \
		@types/react-test-renderer \
		@types/testing-library__jest-dom \
		react-test-renderer \
		jest \
		jest-environment-jsdom \
		@types/jest \
		@types/node \
		--filter react-notion-library

add-test-deps-react-library:
	@pnpm add --save-dev \
		@testing-library/react \
		@testing-library/jest-dom \
		@testing-library/user-event \
		jest \
		jest-environment-jsdom \
		@types/jest \
		--filter react-library
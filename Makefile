
install:
	@pnpm install

build:
	@turbo run build

build-site:
	@turbo run build --filter site-nextjs

format:
	@yarn format

lint:
	@turbo run lint

preview-storybook:
	@turbo run preview --filter storybook

dev:
	@turbo run dev --filter site-nextjs

start:
	@turbo run start --filter site-nextjs

start-site:
	@turbo run start --filter site-nextjs

clean:
	@turbo run clean
	@find . -name 'node_modules' -exec rm -fr {} \;


test:
	@turbo run test

test-site-nextjs:
	@turbo run test --filter site-nextjs

test-blog-content-service:
	@turbo run test --filter blog-content-service

test-logger:
	@turbo run test --filter logger

test-markdown-library:
	@turbo run test --filter markdown-library

test-contentful-adapter:
	@turbo run test --filter contentful-adapter

test-notion-adapter:
	@turbo run test --filter notion-adapter

test-redis-client:
	@turbo run test --filter redis-client

test-react-library:
	@turbo run test --filter react-library

test-react-notion-library:
	@turbo run test --filter react-notion-library




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
		@babel/plugin-transform-modules-commonjs \
		--filter jest-presets \

add-deps-test:
	@pnpm add --save-dev \
		jest \
		@types/jest \
		@types/node \
		--filter logger \
		--filter blog-content-service \
		--filter blog-content-contentful-adapter \
		--filter blog-content-notion-adapter \
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
		react-test-renderer \
		--filter react-library \
		--filter react-notion-library

add-deps-storybook:
	@pnpm add --save-dev \
		@storybook/addon-actions \
        @storybook/addon-docs \
        @storybook/addon-essentials \
        @storybook/addon-interactions \
        @storybook/addon-links \
        @storybook/builder-webpack5 \
		@storybook/manager-webpack5 \
        @storybook/node-logger \
        @storybook/preset-create-react-app \
        @storybook/react \
        @storybook/testing-library \
		--filter storybook

add-deps-markdown-table:
	@pnpm add --save \
		markdown-table \
		--filter markdown-library
	@pnpm add --save-dev \
		@types/markdown-table \
		--filter markdown-library

add-deps-node-cache:
	@pnpm add --save \
		ioredis \
		--filter redis-client

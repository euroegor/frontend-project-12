install:
	pnpm install --frozen-lockfile
	pnpm --dir frontend install --frozen-lockfile

build:
	pnpm --dir frontend run build

start:
	pnpm exec start-server -s ./frontend/dist

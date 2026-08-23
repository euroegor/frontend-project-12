install:
	npx -y pnpm@10.34.5 install --frozen-lockfile
	npx -y pnpm@10.34.5 --dir frontend install --frozen-lockfile

build:
	npx -y pnpm@10.34.5 --dir frontend run build

start:
	npx -y pnpm@10.34.5 exec start-server -s ./frontend/dist

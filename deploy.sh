#!/usr/bin/env sh

# Abort on errors
set -e

# Build
npm run docs:build

# Navigate into the build output directory
cd docs/.vitepress/dist

git init
git add -A
git commit -m 'Actualización de la documentación'

git push -f git@github.com:ComicIvans/server.git main:gh-pages

cd -

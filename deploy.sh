#!/usr/bin/env sh

# Abort on errors
set -e

# Build
npm run docs:build

# Navigate into the build output directory
cd docs/.vitepress/dist

git add -A
git commit -m 'Actualización de la documentación'

git push -u origin gh-pages

cd -
